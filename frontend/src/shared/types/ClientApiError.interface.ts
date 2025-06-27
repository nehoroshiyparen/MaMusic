import { ApiError } from "../../api/types/ApiError.interface";

export class ClientApiError extends Error implements ApiError {
    statusCode: number
    code: string

    constructor(
        statusCode: number,
        errorCode: string,
        message: string,
    ) {
        super(message)
        this.name = 'ClientApiError'
        this.statusCode = statusCode
        this.code = errorCode
    }
}