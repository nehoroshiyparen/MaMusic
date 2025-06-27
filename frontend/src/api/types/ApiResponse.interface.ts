import { ApiError } from "./ApiError.interface"

export interface ApiResponse<T> {
    statusCode: number
    message: string
    data?: T | null
    error?: ApiError
}