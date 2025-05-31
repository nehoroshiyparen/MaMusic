import { credentials } from '@grpc/grpc-js'
import { TokenClient } from '../proto/token/token_grpc_pb'
import dotenv from 'dotenv'

dotenv.config()

const grcpURL = process.env.AUTH_SERVICE_GRPC_URL || 'musiccc-auth-service:60051'

export const grpcAuthClient = new TokenClient(
    grcpURL,
    credentials.createInsecure()
)