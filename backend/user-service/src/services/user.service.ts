import { Sequelize } from "sequelize";
import sequelize from "src/db/config/sequelize";
import { CreateUserEventPayload } from '../grpc/interfaces/user.interface'
import User from "src/db/modules/user_profile.model";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import { logError } from "shared/common/utils/logger/logger";
import { SagaManager } from 'shared/common/saga/sagaManager'
import { AuthProducer } from "src/kafka/producers/auth.producer";

export class UserService {
    constructor(
        private sequelize: Sequelize,
        private kafkaProducer: AuthProducer
    ) {}

    async createUser(payload: CreateUserEventPayload, correlationId: string) {
        const existingUser = await User.findOne({
            where: { username: payload.username }
        })

        if (existingUser) {
            logError('Error while creating user', ApiError.Conflict('User with this username already exists', 'EXISTING USER')) 

            const saga = new SagaManager()
            saga.addStep({
                service: 'auth-service',
                action: async () => this.kafkaProducer.sendUserCreated_Close(correlationId),
            })
            await saga.execute()

            return
        }

        const user = await User.create({
            id: payload.id,
            username: payload.username
        })

        this.kafkaProducer.sendUserCreated_Success(correlationId)

        return user
    }

    async deleteUser(payload: CreateUserEventPayload) {
        try {
            await User.destroy({
                where: {
                    id: payload.id
                }
            })
    
            return 
        } catch (e) {
            throw ApiError.NotFound(`No existing user with this id ${payload.id}`)
        }
    }
}