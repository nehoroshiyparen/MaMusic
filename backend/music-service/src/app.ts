import express, { Application } from 'express'
import dotenv from 'dotenv'
import routes from './routes/index'
import sequelize from './config/db/config/sequelize';
import registerModels from './config/db/modeles/index'
import { getContainer, initContainer } from './di/container';
import { logInfo, logError } from 'shared/common/utils/logger/logger';
import { attachCorrelationId } from 'shared/common/middleware/logger.middleware'
import { errorHandler } from 'shared/common/middleware/error.middleware'

dotenv.config()

class MusicServer {
    private app: Application;
    private readonly port: number;

    constructor() {
        this.app = express()
        this.port = Number(process.env.PORT) || 4002
    }

    private setupMiddleware() {
        this.app.use(express.json())
        this.app.use(attachCorrelationId)
        this.app.use(errorHandler)

        // there are cors + loggers + middlewares
    }

    private setupRoutes() {
        this.app.use(routes)
    }

    private async connectDataBase() {
        try {
            await sequelize.authenticate();
            logInfo('music-db: connection established');
            registerModels();
            await sequelize.sync({ alter: true });
        } catch (e) {
            logError('Unable to connect to the database (music-db)', e);
            throw e;
        }
    }

    public async start() {
        try {
            await this.connectDataBase()

            initContainer()

            this.setupMiddleware()
            this.setupRoutes()

            this.app.listen(this.port, () => {
                logInfo(`Music Service is running on port ${this.port}`)
            })
        } catch (e) {
            logError('Music service failed to start', e)
        }
    }
}

export default MusicServer