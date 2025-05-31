import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError/api-error'

// Логирование ошибки в консоль ( похоже )

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
) {
    const status = err instanceof ApiError ? err.status : 500
    const message = err.message || 'Unexpected error'
    const code = err.code || 'INTERNAL_SERVER_ERROR'

    console.log(`[ERROR] ${req.method} ${req.url}: ${message}`)

    res.status(status).json({
        success: false,
        message,
        code
    })
}