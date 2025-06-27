import { ApiResponse } from "../../../api/types/ApiResponse.interface"
import { ClientApiError } from "../../types/ClientApiError.interface"

export const handleApiResponse = <T>(res: ApiResponse<T>) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
       if (res.data === undefined || res.data === null) {
            if (typeof ({} as T) !== 'undefined') {
                throw new Error('Expected data but none received')
            }
            return undefined as unknown as T
        }

        return res.data
    } else {
        const error = res.error!
        throw new ClientApiError(res.statusCode, error.code, error.message)
    }
} 