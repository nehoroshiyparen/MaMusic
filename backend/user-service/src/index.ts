import express from 'express'
import dotenv from 'dotenv'
import routes from './routes/index'
import { attachCorrelationId } from 'shared/common/middleware/logger.middleware'
import sequelize from './db/config/sequelize'
import registerModels from './db/modules'
import { startGRPCServer } from './grpc/server'
import { KafkaService } from './kafka/kafka.service'
import { Container } from './di/container'
import { logError } from 'shared/common/utils/logger/logger'

dotenv.config()

const app = express()
app.use(express.json())

app.use(attachCorrelationId)

app.use(routes)

const connectDB = async() => {
    try {
        await sequelize.authenticate()
        console.log('user-db: connetcion established')

        registerModels()

        await sequelize.sync({ alter: true })
    } catch (e) {
        console.log('Unable to connect to the database(user-db): ', e)
        throw e
    }
}

const startKafkaService = async() => {
    try {
        const DIContainer = new Container()

        const kafkaService = DIContainer.getKafkaService()
        const consumers = [DIContainer.getAuthConsumer()]

        await kafkaService.connect()

        for (const consumer of consumers) {
            await consumer.handle()
        }

        console.log('Kafka started [user-service]')
    } catch (e) {
        logError('Kafka startup error [user-service]', e)
    }
}

const startServer = (port: number) => {
    app.listen(port, () => {
        console.log(`User Service started on PORT: ${port}`)
    })
}

const startApp = async() => {
    await connectDB()
    const PORT = Number(process.env.PORT) || 4003
    startGRPCServer()
    await startKafkaService()
    startServer(PORT)
}

startApp().catch((e) => {
    console.log('User Service failed to start due to error: ', e)
})