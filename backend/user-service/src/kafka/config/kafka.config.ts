import { Kafka, KafkaConfig } from "kafkajs";
import dotenv from 'dotenv'

dotenv.config()
const url = process.env.KAFKA_BROKERS

const kafkaConfig: KafkaConfig = { 
    brokers: [`${url}`],
     clientId: 'user-service' 
}

export const kafka = new Kafka(kafkaConfig)