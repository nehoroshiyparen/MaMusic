import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes'
import { attachCorrelationId } from 'shared/common/middleware/logger.middleware'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4001

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(cookieParser())

app.use(attachCorrelationId)

app.use(routes)

app.listen(PORT, () => {
    console.log(`Gateway is running on PORT: ${PORT}`)
})