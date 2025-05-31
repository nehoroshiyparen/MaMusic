import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { TokenPayload } from 'shared/auth/payload/token.payload'
import RefreshToken from 'src/db/models/RefreshToken.model'
import { Transaction } from 'sequelize'

dotenv.config()

// Сервис выдачи и валидации JWT-токенов 

export class TokenService {
    private accessPrivateKey: string = process.env.ACCESS_TOKEN_PRIVATE_KEY! || ''
    private refreshPrivateKey: string = process.env.REFRESH_TOKEN_PRIVATE_KEY! || ''
    private accessPublicKey: string = process.env.ACCESS_TOKEN_PUBLIC_KEY! || ''
    private refreshPublicKey: string = process.env.REFRESH_TOKEN_PUBLIC_KEY! || ''
    private accessTokenExpiresIn: number = Number(process.env.ACCESS_TOKEN_EXPIRES_IN)
    private refreshTokenExpiresIn: number = Number(process.env.REFRESH_TOKEN_EXPIRES_IN)

    async generateAccessToken(payload: TokenPayload) {
        const accessToken = jwt.sign(payload, this.accessPrivateKey, {
            algorithm: 'RS256',
            expiresIn: this.accessTokenExpiresIn
        })

        return accessToken
    }

    async generateRefreshToken(payload: TokenPayload, transaction?: Transaction) {
        const refreshToken = jwt.sign(payload, this.refreshPrivateKey, {
            algorithm: 'RS256',
            expiresIn: this.refreshTokenExpiresIn
        })

        await RefreshToken.destroy({
            where: { user_id: payload.id },
            transaction
        })

        await RefreshToken.create({
            user_id: payload.id,
            token: refreshToken
        }, {
            transaction
        })

        return refreshToken
    }

    verifyAccesToken(token: string): TokenPayload {
        try {
            const decoded = jwt.verify(token, this.accessPublicKey, { algorithms: ['RS256'] }) as TokenPayload
            return decoded
        } catch (e) {
            throw new Error('Invalid or expired access token')
        }
    }

    verifyRefreshToken(token: string): TokenPayload {
        try {
            const decoded = jwt.verify(token, this.refreshPublicKey, { algorithms: ['RS256'] }) as TokenPayload
            return decoded
        } catch (e) {
            throw new Error('Invalid or expired refresh token')
        }
    }

    async removeRefreshToken(userId: number): Promise<boolean> {
        const token = await RefreshToken.findOne({ 
            where: {
                user_id: userId
            }
        })

        if (!token) {
            return false
        }

        await RefreshToken.destroy({
            where: {
                user_id: userId
            }
        })
        return true
    }
}