import { credentials } from "@grpc/grpc-js";
import { AuthUserClient } from "../proto/auth/auth_grpc_pb";
import dotenv from 'dotenv'

dotenv.config()

const grpcURL = process.env.USER_SERVICE_GRPC_URL || 'musiccc-user-service:60052'

export const grpcUserClient = new AuthUserClient(
    grpcURL,
    credentials.createInsecure()
)