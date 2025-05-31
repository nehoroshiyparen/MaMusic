import { Response } from 'express'
import { ApiError } from 'shared/common/utils/ApiError/api-error'
import { logError } from '../logger/logger'
import { isError } from '../typeGuards/isError'
import { ApiResponse } from 'shared/common/types/api-response.interface'

export function sendError(res: Response, err: unknown) {
    let statusCode = 500
    let errorMessage = 'Unexpected error'
    let errorCode = 'UNEXPECTED_ERROR'

    if (err instanceof ApiError) {
        logError(`API Error: ${err.code || null} - ${err.message}`, err.cause || err)

        statusCode = err.status
        errorMessage = err.message
        errorCode = err.code ? err.code : ''
    } else {
        if (isError(err)) {
            logError('Неизвестная ошибка', err)
        }
    }

    const response: ApiResponse<void> = {
        statusCode,
        message: 'Server side error',
        error: {
            code: errorCode,
            message: errorMessage
        }
    }

    return res.status(statusCode).json(response)
}