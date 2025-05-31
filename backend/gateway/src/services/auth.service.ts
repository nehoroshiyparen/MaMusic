import { grpcAuthClient } from "src/grpc/clients/auth.client";
import { RefreshTokenRequest } from "src/grpc/proto/auth/auth_pb";

export class AuthService {
    async refreshAccessToken(refreshToken: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const request = new RefreshTokenRequest()
            request.setRefreshtoken(refreshToken)

            grpcAuthClient.refreshToken(request, (err, response) => {
                if (err || !response) return reject(err)
                resolve(response.getAccesstoken())
            })
        })
    }
}