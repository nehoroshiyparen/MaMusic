import { ApiError } from "./api-error";

export function rethrowAsApiError(message: string, code: string, error: unknown): never {
    if (error instanceof ApiError) throw error
    throw ApiError.Internal(message, code, error)
}