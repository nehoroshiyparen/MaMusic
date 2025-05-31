export class ApiError extends Error {
    status: number;
    code?: string;
    cause?: unknown;

    constructor(status: number, message: string, code?: string, cause?: unknown) {
        super(message)
        this.status = status
        this.code = code
        this.cause = cause

        Object.setPrototypeOf(this, ApiError.prototype)
    }

    static BadRequest(message = 'Bad Request', code?: string, cause?: unknown) {
        return new ApiError(400, message, code, cause)
    }

    static Unauthorized(message = 'Unauthorized', code?: string, cause?: unknown) {
        return new ApiError(401, message, code, cause)
    }

    static NoAccess(message = 'No access', code?: string, cause?: unknown) {
        return new ApiError(403, message, code, cause)
    }

    static NotFound(message = 'Not Found', code?: string, cause?: unknown) {
        return new ApiError(404, message, code, cause)
    }

    static Conflict(message = 'Conflict', code?: string, cause?: unknown) {
        return new ApiError(409, message, code, cause)
    }

    static Internal(message = 'Interna Server Error', code?: string, cause?: unknown) {
        return new ApiError(500, message, code, cause)
    }
}