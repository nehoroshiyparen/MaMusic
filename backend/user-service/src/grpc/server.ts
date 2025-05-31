import { Server, ServerCredentials } from "@grpc/grpc-js"
import dotenv from 'dotenv'
import { AuthUserService } from './proto/auth/auth_grpc_pb'
import { AuthUserHandler } from "./handlers/authUser.handler"
import { ApiError } from "shared/common/utils/ApiError/api-error"

dotenv.config()

export const startGRPCServer = () => {
    const server = new Server()
    const GRPC_PORT = Number(process.env.GRPC_PORT)

    server.addService(AuthUserService, AuthUserHandler)

    server.bindAsync(`0.0.0.0:${GRPC_PORT}`, ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            throw ApiError.Internal(`Failed to start GRPC server on User Service: ${err}`)
        }
        console.log(`GRPC server (User Service) running at http://user-service:${port}`)
    })
}