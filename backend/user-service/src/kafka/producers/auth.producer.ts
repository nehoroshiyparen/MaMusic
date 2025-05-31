import { Consumer, Producer } from "kafkajs";
import { UserCreatePayload } from "../types/userCreate.payload";
import { AUTH_TOPICS, SAGA_TOPICS } from "../topics";
import { logError, logInfo } from "shared/common/utils/logger/logger";
import { kafka } from "../config/kafka.config";

export class AuthProducer {
    constructor(
        private producer: Producer
    ) {}

    async sendUserCreated_Success(correlationId: string) {
        try {
            const message = JSON.stringify({
                from: 'user-service',
                status: 'ok'
            })

            await this.producer.send({
                topic: SAGA_TOPICS.SAGA_REPLY.topic,
                messages: [
                    {
                        key: 'user-service',
                        headers: { correlationId: correlationId, service: 'user-service' },
                        value: message
                    }
                ]
            })

            logInfo(`Kafka mailing to [auth-service]`, correlationId)
        } catch (e) {
            logError(`Error while sending messages with kafka from ${`user-service`}`, e)
        }
    }

    async sendUserCreated_Close(correlationId: string) {
        try {
            const message = JSON.stringify({
                from: 'user-service',
                status: 'error',
            })

            await this.producer.send({
                topic: SAGA_TOPICS.SAGA_REPLY.topic,
                messages: [
                    {
                        key: 'user-service',
                        headers: { correlationId: correlationId, service: `user-service` },
                        value: message
                    }
                ]
            })

            logInfo(`Kafka mailing to [auth-service]`, correlationId)
        } catch (e) {
            logError(`Error while sending messages with kafka from ${`user-service`}`, e)
        }
    }

    getProducer() {
        return this.producer
    }
}