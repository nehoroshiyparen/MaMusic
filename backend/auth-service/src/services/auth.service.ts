import { RegisterDto } from "src/dto/register.dto";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";
import { UserService } from "./user.service";
import { LoginDto } from "src/dto/login.dto";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import { rethrowAsApiError } from "shared/common/utils/ApiError/rethrowApiError"
import { emailSchema } from "src/payload/email.payload";
import { Sequelize, Transaction } from "sequelize";
import { SagaManager } from 'shared/common/saga/sagaManager'
import { AuthProducer } from "src/kafka/produsers/auth.producer";
import { SagaReplyConsumer } from "src/kafka/consumers/sagaReply.consumer";
import { SagaWaiter } from "shared/common/saga/sagaWaiter";
import { logError, logInfo, logWarn } from "shared/common/utils/logger/logger";
import { TokenPayload } from "shared/auth/payload/token.payload";
import { CleanTokenPayload } from "shared/auth/payload/cleanToken.payload";

export class AuthService {
    constructor(
        private sequelize: Sequelize,
        private userService: UserService,
        private passwordService: PasswordService,
        private tokenService: TokenService,
        private authProducer: AuthProducer,
        private sagaWaiter: SagaWaiter,
    ) {}

    async register(data: RegisterDto, correlationId: string) {
        const transaction = await this.sequelize.transaction()
        const saga = new SagaManager()

        try {
            const existingUsername = await this.userService.findUser({ username: data.username })
            if (existingUsername) {
                throw ApiError.Conflict('Пользователь с таким именем уже существует', 'USERNAME_ALREADY_EXISTS')
            }

            const existingEmail = await this.userService.findUser({ email: data.email })
            if (existingEmail) {
                throw ApiError.Conflict('Пользователь с такой почтой уже сущесвтует', 'EMIAL_ALREADY_EXISTS')
            }

            const hashPassword = await this.passwordService.hashPassword(data.password)

            const user = await this.userService.createUser({
                username: data.username,
                email: data.email,
                password: hashPassword,
            }, transaction)
    
            const userPayload = {
                id: user.id,
                email: user.email,
                username: user.username,
            }
    
            const accessToken = await this.tokenService.generateAccessToken(userPayload)
            const refreshToken = await this.tokenService.generateRefreshToken(userPayload, transaction)

            await this.sagaWaiter.createWaiter(correlationId, 1)

            await saga.addStep({
                service: 'auth-service',
                action: async () => {
                    this.authProducer.sendUserCreated(userPayload, correlationId)
                },
                compensation: async () => this.authProducer.sendUserCreated_Close(userPayload, correlationId)
            })

            await saga.addStep({
                service: 'auth-service',
                action: async () => {
                    const result = await this.sagaWaiter.waitForAcks(correlationId)
                    if (result.some(res => res.type === 'fail')) {
                        throw new Error('One of the services failed during saga execution')
                    }
                },
            })

            await saga.execute()
            
            await transaction.commit()
    
            return { accessToken, refreshToken, userPayload }
        } catch (e) {
            await transaction.rollback()
            throw rethrowAsApiError('Ошибка при создании пользователя', 'USER_CREATE_ERROR', e)
        }
    }

    async login(data: LoginDto) {
        const user = await (async () => {
            if (emailSchema(data.identifier)) {
                const found = await this.userService.findUser({ email: data.identifier });
                if (!found) {
                    throw ApiError.Unauthorized('Invalid email', 'INVALID_EMAIL');
                }
                return found;
            } else {
                const found = await this.userService.findUser({ username: data.identifier });
                if (!found) {
                    throw ApiError.Unauthorized('Invalid username', 'INVALID_USERNAME');
                }
                return found;
            }
        })()

        const isPasswordValid = await this.passwordService.comparePasswords(data.password, user.password_hash)

        if (!isPasswordValid) {
            throw ApiError.Unauthorized('Invalid password', 'INVALID_PASSWORD')
        }

        const userPayload = {
            id: user.id,
            email: user.email,
            username: user.username,
        }

        const accessToken = await this.tokenService.generateAccessToken(userPayload)
        const refreshToken = await this.tokenService.generateRefreshToken(userPayload)

        return { accessToken, refreshToken, userPayload }
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.Unauthorized('No refresh token provided', 'NO_TOKEN');
        }

        const payload = this.tokenService.verifyRefreshToken(refreshToken)
        if (!payload) {
            throw ApiError.Unauthorized('Ivalid or expired refresh token', 'INVALID_REFRESH_TOKEN')
        }

        const user = await this.userService.findUser({ id: payload.id })
        if (!user) {
            throw ApiError.Unauthorized('User not found', 'USER_NOT_FOUND')
        }

        const userPayload = {
            id: user.id,
            email: user.email,
            username: user.username,
        }

        const accessToken = await this.tokenService.generateAccessToken(userPayload)

        return { accessToken }
    }

    async logout(userId: number) {
        const result = await this.tokenService.removeRefreshToken(userId)

        if (!result) {
            throw ApiError.BadRequest('Failed to log out. Token not found')
        }

        return { message: 'Logged out successfully' }
    }

    async authMe(accessToken: string | null, refreshToken: string | null, correlationId: string | undefined): Promise<{ decoded: CleanTokenPayload, accessToken?: string }> {
        try {
            if (!accessToken) {
                logWarn('No access token provided. Trying to refresh it', correlationId)
                throw ApiError.Unauthorized('No access token provided', 'NO_ACCESS_TOKEN')
            }
            const decoded = this.tokenService.verifyAccesToken(accessToken)
            return { decoded }
        } catch (e) {
            console.log(e)

            if (!refreshToken) {
                throw ApiError.Unauthorized('No refresh token provided', 'NO_REFRESH_TOKEN')
            }

            try {
                logWarn('Access token expired; refreshing...', correlationId)

                const decoded = await this.tokenService.verifyRefreshToken(refreshToken)

                const newAccessToken = await this.tokenService.generateAccessToken(decoded)

                logInfo(`Access token refreshed for user: ${decoded.username}`, correlationId)
                return { decoded, accessToken: newAccessToken }
            } catch (e) {
                logError('Failed to refresh token', e, correlationId)
                throw ApiError.Unauthorized('Failed to refresh the access token', 'ACCESS_TOKEN_REFRESH_ERROR')
            }
        }
    }
}