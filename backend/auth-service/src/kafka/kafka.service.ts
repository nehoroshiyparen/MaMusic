import { logError, logInfo } from 'shared/common/utils/logger/logger'
import { kafka } from './config/kafka.config'
import { Consumer, Producer } from 'kafkajs';

export class KafkaService {
    private producer: Producer;
    private consumer: Consumer;

    constructor(
        producer: Producer,
        consumer: Consumer
    ) {
        this.producer = producer
        this.consumer = consumer
    }

    async connect(): Promise<void> {
        try {
            this.producer.connect()
            this.consumer.connect()
        } catch(e) {
            logError('Kafka [auth-service] connection error', e)
        }
    }

    async disconnect(): Promise<void> {
        try {
            this.producer.disconnect()
            this.consumer.disconnect()
        } catch (e) {
            logError('Kafka [auth-service] disconnect error', e)
        }
    }
}

