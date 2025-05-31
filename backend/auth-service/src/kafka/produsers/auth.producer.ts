import { SimpleProducer } from 'shared/common/kafka/interfaces/simpleProducer.interface'
import { Producer } from 'kafkajs'
import { logError, logInfo } from 'shared/common/utils/logger/logger';
import { UserCreatePayload } from 'src/kafka/types/userCreate.payload';
import { AUTH_TOPICS } from '../topics';

export class AuthProducer {
    constructor(
        private producer: Producer
    ) {}

    async sendUserCreated(payload: UserCreatePayload, correlaionId: string) {
        try {
            const message = JSON.stringify(payload)

            await this.producer.send({
                topic: AUTH_TOPICS.USER_CREATE.topic,
                messages: [
                    {
                        key: 'user-service',
                        headers: { correlationId: correlaionId },
                        value: message
                    },
                ]
            })

            logInfo(`Kafka mailing to [user-service], topic is: '${AUTH_TOPICS.USER_CREATE.topic}'`, correlaionId)
        } catch(e) {
            logError(`Error while sending messages with kafka from ${AUTH_TOPICS.USER_CREATE.sender}`, e)
        }
    }

    async sendUserCreated_Close(payload: UserCreatePayload, correlaionId: string) {
        try {
            const message = JSON.stringify(payload)

            await this.producer.send({
                topic: AUTH_TOPICS.USER_CREATE_CLOSE.topic,
                messages: [
                    {
                        key: 'user-service',
                        headers: { correlaionId: correlaionId},
                        value: message
                    }
                ]
            })

            logInfo(`Kafka mailing to [user-service]`, correlaionId)
        } catch (e) {
            logError(`Error while sending messages with kafka from ${AUTH_TOPICS.USER_CREATE_CLOSE.sender}`, e)
        }
    }
}