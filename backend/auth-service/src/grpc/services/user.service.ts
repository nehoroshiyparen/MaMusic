import { ApiError } from "shared/common/utils/ApiError/api-error";
import { grpcUserClient } from "../clients/user.client";
import { CreateUserRequest, CreateUserResponse } from "../proto/auth/auth_pb"
import { status } from '@grpc/grpc-js'
import { logInfo } from "shared/common/utils/logger/logger";
import dotenv from 'dotenv'

dotenv.config()

const gRPCserverURL = process.env.USER_SERVICE_GRPC_URL

export class UserPROTOService {
    async createUser(payload: {id: number, username: string, email: string}): Promise<CreateUserResponse> {
        return new Promise((resolve, reject) => {
            const request = new CreateUserRequest()
            request.setId(payload.id)
            request.setEmail(payload.email)
            request.setUsername(payload.username)

            logInfo(`Incoming request to ${gRPCserverURL}`, )

            grpcUserClient.createUser(request, (err, response: CreateUserResponse | null) => {
                if (err) {
                    console.log('[gRPC client] createUser err: ', err)
                    switch(err.code) {
                        case (status.ALREADY_EXISTS):
                            return reject(ApiError.Conflict(err.message, 'USER_ALREADY_EXISTS'))
                        default:
                            return reject(ApiError.Internal(`gRPC error: ${err.details}`, 'GRPC_ERROR'))
                    }
                }
                if (!response || typeof response.getCode !== 'function') {
                    return reject(ApiError.Internal('No response from user service', 'NO_GRPC_RESPONSE'))
                }

                console.log('[gRPC client] createUser response:', {
                    code: response.getCode?.(),
                })
                
                return resolve(response)
            })
        })
    }
}