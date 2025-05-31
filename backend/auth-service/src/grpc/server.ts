import { Server, ServerCredentials } from '@grpc/grpc-js'
import { TokenService } from './proto/token/token_grpc_pb'
import { TokenHandler } from './handlers/token.handler'
import { ApiError } from 'shared/common/utils/ApiError/api-error'

export const startGrpcServer = () => {
    const server = new Server()
    const GRPC_PORT = Number(process.env.GRPC_PORT)

    server.addService(TokenService, TokenHandler)

    server.bindAsync(`0.0.0.0:${GRPC_PORT}`, ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            throw ApiError.Internal(`Failed to start GRPC server: ${err}`)
        }
        console.log(`GRPC server (Auth Service) running at http://auth-service:${port}`)
    })
}