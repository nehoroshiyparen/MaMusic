import { Consumer, EachMessagePayload, Kafka } from "kafkajs";
import { AuthService } from "src/services/auth.service";
import { AUTH_TOPICS } from "../topics";
import { logError, logInfo, logWarn } from "shared/common/utils/logger/logger";
import { UserCreatePayload } from "../types/userCreate.payload";
import { UserService } from "src/services/user.service";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import { kafka } from "../config/kafka.config";

export class AuthConsumer {
    private kafka: Kafka;
    private consumer: Consumer;

    constructor(
        private userService: UserService
    ) {
        this.kafka = kafka
        this.consumer = this.kafka.consumer({ groupId: 'auth-group' })
    }

    async handle() {
        await this.consumer.connect()
        await this.consumer.subscribe({ topic: AUTH_TOPICS.USER_CREATE_CLOSE.topic, fromBeginning: true })

        await this.consumer.run({
            eachMessage: async ({topic, message}: EachMessagePayload) => {
                const correlationId = message.headers?.correlationId?.toString()
                const sender = message.headers?.sender?.toString()

                logInfo(`Trying to process request from ${sender}`, correlationId)

                switch (topic) {
                    case 'user.create.close': {
                        try {
                            logInfo(`Closing operation [user.create]`, correlationId)

                            const payload = JSON.parse(message.value!.toString()) as UserCreatePayload

                            await this.userService.deleteUser(payload.id)

                            return
                        } catch (e) {
                            if (e instanceof ApiError) {
                                logWarn(`User not found when attempting rollback. Skipping.`, correlationId)
                            } else {
                                logError('Unexpected error during rollback operation', e)
                            }
                        }
                    }

                    default: {
                        logWarn(`No such topic ${topic} in auth.consumer [auth-service]`)
                        return
                    }
                }
            }
        })
    }
}