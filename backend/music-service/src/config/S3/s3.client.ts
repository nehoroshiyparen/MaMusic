import { S3Client } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

dotenv.config()

export const s3 = new S3Client({
    region: 'ru-central1',
    endpoint: 'https://storage.yandexcloud.net',
    credentials: {
        accessKeyId: process.env.YC_ACCESS_KEY_ID!,
        secretAccessKey: process.env.YC_SECRET_ACCESS_KEY!
    }
})