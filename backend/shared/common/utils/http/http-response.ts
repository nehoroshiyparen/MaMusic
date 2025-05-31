import { Response } from 'express'
import { ApiResponse } from '../../types/api-response.interface'

export function sendResponse<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T,
) {
    const response: ApiResponse<T> = {
        statusCode,
        message,
        data
    }

    return res.status(statusCode).json(response)
}