import { ApiError } from "shared/common/utils/ApiError/api-error";
import { grpcAuthClient } from "src/grpc/clients/auth.client";
import { RefreshTokenRequest, RefreshTokenResponse } from "src/grpc/proto/token/token_pb";
import { status } from '@grpc/grpc-js'

export class TokenService {
    async refreshAccessToken(refreshToken: string): Promise<string> {
      return new Promise((resolve, reject) => {
        const request = new RefreshTokenRequest()
        request.setRefreshtoken(refreshToken)
  
        grpcAuthClient.refreshToken(request, (err, response: RefreshTokenResponse | null) => {
          if (err) {
            // Конвертим grpc Error в ApiError
            console.error('[gRPC client] refreshToken err:', err)
            switch (err.code) {
              case status.UNAUTHENTICATED:
                return reject(ApiError.Unauthorized(err.details, 'REFRESH_UNAUTHENTICATED'))
              default:
                return reject(ApiError.Internal(`gRPC error: ${err.details}`, 'GRPC_ERROR'))
            }
          }
          if (!response) {
            return reject(ApiError.Internal('No response from auth service', 'NO_GRPC_RESPONSE'))
          }
          resolve(response.getAccesstoken())
        })
      })
    }
  }