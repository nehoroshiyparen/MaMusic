import { Response } from 'express'
import { ApiError } from 'shared/common/utils/ApiError/api-error'
import { logError } from '../logger/logger'
import { isError } from '../typeGuards/isError'
import { ApiResponse } from 'shared/common/types/api-response.interface'
import { isZodError } from '../typeGuards/isZodError'

export function sendError(res: Response, err: unknown) {
    let statusCode = 500
    let message = 'Server side error'
    let errorMessage = 'Unexpected error'
    let errorCode = 'UNEXPECTED_ERROR'

    if (err instanceof ApiError) {
        logError(`API Error: ${err.code || null} - ${err.message}`, err.cause || err)

        statusCode = err.status
        message = 'Predicted error'
        errorMessage = err.message
        errorCode = err.code ? err.code : ''
    } else if (isZodError(err)) {
        logError(`Zod Error: VALIDATION_ERROR - ${err.message}`, err)
        statusCode = 400
        message = 'Not valid dto'
        errorMessage =  err.issues
            .map(issue => `${issue.message}`)
            .join(', ')
        errorCode = 'VALIDATION_ERROR'
    } else {
        if (isError(err)) {
            logError('Неизвестная ошибка', err)
        }
    }

    const response: ApiResponse<void> = {
        statusCode,
        message,
        error: {
            code: errorCode,
            message: errorMessage
        }
    }

    return res.status(statusCode).json(response)
}