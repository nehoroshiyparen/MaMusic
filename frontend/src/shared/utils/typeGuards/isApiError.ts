import { ApiError } from "../../../api/types/ApiError.interface";

export function isApiError(error: unknown): boolean {
    return (
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        error.name === 'ClientApiError'
    )
}