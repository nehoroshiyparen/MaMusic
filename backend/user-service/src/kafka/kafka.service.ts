import { logError } from "shared/common/utils/logger/logger"
import { kafka } from "./config/kafka.config"
import { Consumer, Producer } from "kafkajs"
import { UserService } from "src/services/user.service"

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
            console.log(`Kafka connected successfuly [user-service]`)
        } catch(e) {
            logError('Kafka [user-service] connection error', e)
        }
    }

    async disconnect(): Promise<void> {
        try {
            this.producer.disconnect()
            this.consumer.disconnect()
        } catch (e) {
            logError('Kafka [user-service] disconnect error', e)
        }
    }
}

