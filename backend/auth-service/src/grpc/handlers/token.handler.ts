import { RefreshTokenRequest, RefreshTokenResponse } from "../proto/token/token_pb";
import { Metadata, sendUnaryData, ServerUnaryCall, ServiceError } from '@grpc/grpc-js'
import { AuthService } from "src/services/auth.service";
import { ITokenServer } from '../proto/token/token_grpc_pb'
import { status } from '@grpc/grpc-js'
import { ApiError } from "shared/common/utils/ApiError/api-error";
import { getContainer } from "src/di/container";

export const TokenHandler: ITokenServer = {
    refreshToken: async (
      call: ServerUnaryCall<RefreshTokenRequest, RefreshTokenResponse>,
      callback: sendUnaryData<RefreshTokenResponse>
    ) => {
      try {
        const authService = getContainer().getAuthService();

        const refreshToken = call.request.getRefreshtoken()
        const { accessToken } = await authService.refresh(refreshToken)
  
        const response = new RefreshTokenResponse()
        response.setAccesstoken(accessToken)
        return callback(null, response)
  
      } catch (err) {
        let code = status.INTERNAL as number
        let details = 'Internal server error'
  
        if (err instanceof ApiError) {
          code = status.UNAUTHENTICATED
          details = err.message
        } else if (err instanceof Error) {
          details = err.message
        }
  
        console.error('[gRPC][refreshToken] error:', err)

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
  