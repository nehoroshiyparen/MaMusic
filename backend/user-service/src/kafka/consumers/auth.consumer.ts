import { Consumer, EachMessagePayload } from 'kafkajs'
import { AUTH_TOPICS } from '../topics';
import { logError, logInfo, logWarn } from 'shared/common/utils/logger/logger';
import { UserCreatePayload } from '../types/userCreate.payload';
import { UserService } from '../../services/user.service';
import { ApiError } from 'shared/common/utils/ApiError/api-error';
import { kafka } from '../config/kafka.config';

export class AuthConsumer {
    private consumer: Consumer

    constructor(
        private userService: UserService
    ) {
        this.consumer = kafka.consumer({ groupId: 'user-group' })
    }

    async handle() {
        await this.consumer.connect()
        await this.consumer.subscribe({ topic: AUTH_TOPICS.USER_CREATE.topic, fromBeginning: true })

        console.log(`Subscribed to ${AUTH_TOPICS.USER_CREATE.topic}`)
        
        await this.consumer.run({
            eachMessage: async ({topic, message}: EachMessagePayload) => {
                const correlationId = message.headers!.correlationId!.toString()

                logInfo(`Trying to process the request from ${'auth-service'}`, correlationId)

                switch (topic) {
                    case 'user.create': {
                        try {
                            const payload = JSON.parse(message.value!.toString()) as UserCreatePayload

                            await this.userService.createUser(payload, correlationId)
                        } catch (e) {
                            logError('Internal error while creating user', e)
                        }
                        return
                    }

                    default: {
                        logWarn(`No such topic ${topic} in auth.consumer [user-service]`)
                        return
                    }
                }
            }
        })
    }

    getConsumer() {
        return this.consumer
    }
}