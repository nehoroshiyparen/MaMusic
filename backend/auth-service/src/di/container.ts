import { ApiError } from "shared/common/utils/ApiError/api-error";
import { Container } from "./container.class";

let container: Container | null = null

export const initContainer = () => {
    container = new Container()
}

export const getContainer = (): Container => {
    if (!container) throw ApiError.Internal('DI Container not initialized')
    return container
}