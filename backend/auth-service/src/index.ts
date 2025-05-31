import express from 'express'
import dotenv from 'dotenv'
import routes from './routers/index'
import { attachCorrelationId } from 'shared/common/middleware/logger.middleware'
import { errorHandler } from 'shared/common/middleware/error.middleware'
import sequelize from './db/config/sequelize'
import registerModels from './db/models'
import { startGrpcServer } from './grpc/server'
import { KafkaService } from './kafka/kafka.service'
import { Container } from './di/container.class'
import { logError } from 'shared/common/utils/logger/logger'
import { getContainer, initContainer } from './di/container'

dotenv.config()

const app = express()
app.use(express.json())

app.use(attachCorrelationId)

app.use(routes)

app.use(errorHandler)

const connectDB = async() => {
    try {
        await sequelize.authenticate()
        console.log('auth-db: connection established')

        registerModels()

        await sequelize.sync({ alter: true })
    } catch (e) {
        console.log('Unable to connect to the database(auth-db): ', e)
        throw e
    }
}

const startKafkaService = async() => {
    try {
        const DIContainer = getContainer()

        const kafkaService = DIContainer.getKafkaService()
        const consumers = [DIContainer.getAuthConsumer(), DIContainer.getSagaReplyConsumer()]

        await kafkaService.connect()

        for (const consumer of consumers) {
            await consumer.handle()
        }

        console.log('Kafka started [auth-service]')
    } catch (e) {
        logError('Kafka startup error [auth-service]', e)
    }
}

const startServer = (port: number) => {
    app.listen(port, () => {
        console.log(`Auth Service is started on PORT: ${port}`)
    })
}

const startApp = async() => {
    await connectDB()
    initContainer()
    const SERVER_PORT = Number(process.env.PORT) || 4003
    startGrpcServer()
    await startKafkaService()
    startServer(SERVER_PORT)   
}

startApp().catch((e) => {
    console.log('Auth Service failed to start due to error: ', e)
})