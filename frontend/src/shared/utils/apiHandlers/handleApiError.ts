import { isAxiosError } from "axios";
import { isApiError } from "../typeGuards/isApiError";

export function handleApiError<T extends (message: string) => any>(
    e: unknown,
) {
    let message = "Something gone wrong... ¯\_(ツ)_/¯"

    if (isAxiosError(e)) {
        const data = e.response?.data
        if (isApiError(data)) {
            message = data.message
        } else if (typeof data?.message === 'string') {
            message = data.message
        }
    } else if (e instanceof Error) {
        message = e.message
    }
}