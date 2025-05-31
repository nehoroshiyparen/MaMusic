import { Consumer, Kafka } from 'kafkajs';
import { SagaWaiter } from 'shared/common/saga/sagaWaiter'
import { kafka } from '../config/kafka.config';
import { logError, logWarn } from 'shared/common/utils/logger/logger';

export class SagaReplyConsumer {
    private kafka: Kafka;
    private sagaWaiter: SagaWaiter;
    private consumer: Consumer;

    constructor(sagaWaiter: SagaWaiter) {
        this.kafka = kafka
        this.sagaWaiter = sagaWaiter
        this.consumer = this.kafka.consumer({ groupId: 'saga-group' })
    }

    async handle() {
        await this.consumer.connect()
        await this.consumer.subscribe({ topic: 'saga-reply', fromBeginning: false})

        console.log('письки')

        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log('Incoming request from "user-service"')
                try {
                    const value = message.value?.toString()
                    if (!value) return

                    const correlationId = message.headers?.correlationId?.toString()
                    const service = message.headers?.service?.toString()

                    const parsed = JSON.parse(value)

                    if (!correlationId || !service) {
                        logWarn('Missing headers in saga-reply message')
                        return
                    }

                    this.sagaWaiter.onMessage(correlationId, {
                        from: service,
                        type: parsed.status === 'ok' ? 'success' : 'fail',
                        data: parsed
                    })
                } catch (e) {
                    logError('Kafka message parse error:', e)
                }
            }
        })
    }
}