import { UserService } from "src/services/user.service";
import { IAuthUserServer } from "../proto/auth/auth_grpc_pb";
import { Metadata, sendUnaryData, ServerUnaryCall, ServiceError, status } from "@grpc/grpc-js";
import { CreateUserRequest, CreateUserResponse } from "../proto/auth/auth_pb";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import { Container } from '../../di/container'

const DIContainer = new Container()
const userService = DIContainer.getUserService()

export const AuthUserHandler: IAuthUserServer = {
    createUser: async (
        call: ServerUnaryCall<CreateUserRequest, CreateUserResponse>,
        callback: sendUnaryData<CreateUserResponse>
    ) => {
        try {
            const payload = {
                id: call.request.getId(),
                username: call.request.getUsername(),
                email: call.request.getEmail()
            }

            await userService.createUser(payload)
            const response = new CreateUserResponse()
            response.setCode(200)
            return callback(null, response)
        } catch (e) {
            let code = status.INTERNAL as number
            let details = 'Internal server error'

            if (e instanceof ApiError) {
                code = status.ALREADY_EXISTS
                details = e.message
            } else if (e instanceof Error) {
                details = e.message
            }

            console.log('[gRPC][authUser] error:', e)
            
            const error = {
                name: 'Error',
                message: details,
                code,
                details,
                metadata: new Metadata()
            } as ServiceError

            return callback(error, null)
        }
    }
}