import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { ApiError } from 'shared/common/utils/ApiError/api-error'
import { TokenPayload } from 'shared/auth/payload/token.payload'
import { TokenService } from '../grpc/services/auth.service'
import { logError, logInfo, logWarn } from 'shared/common/utils/logger/logger'
import { sendError } from 'shared/common/utils/http'

dotenv.config()
const publicKey = process.env.ACCESS_TOKEN_PUBLIC_KEY!
const tokenGRPCService = new TokenService()

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies?.accessToken
  const correlationId = req.headers['x-correlation-id'] as string | undefined

  if (!accessToken) {
    logWarn('No access token provided. Trying to refresh it', correlationId)
  }

  try {
    const decoded = jwt.verify(accessToken, publicKey) as TokenPayload
    req.headers['x-user-id'] = String(decoded.id)
    return next()
  } catch (_err) {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) {
      sendError(res, ApiError.Unauthorized('No refresh token found', 'NO_REFRESH_TOKEN'))
    }

    try {
      logWarn('Access token expired; refreshing...', correlationId)
      const newAccessToken = await tokenGRPCService.refreshAccessToken(refreshToken)

      const decoded = jwt.verify(newAccessToken, publicKey) as TokenPayload
      req.headers['x-user-id'] = String(decoded.id)

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 18000000
      })
      logInfo(`Refreshed access token for user ${decoded.username}`, correlationId)
      next()
    } catch (err) {
      logError('Failed to refresh the access token', err as Error, correlationId, accessToken)
      sendError(res, err)
    }
  }
}