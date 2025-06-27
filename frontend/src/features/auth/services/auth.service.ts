import { handleApiResponse } from "../../../shared/utils/handlers/handleApiResponse";
import { authApi } from "../api/auth.api";

class AuthService {
    async register(username: string, email: string, password: string) {
        const response = await authApi.register(username, email, password)
        
        return handleApiResponse(response)
    }
}

export default new AuthService() // Пока что синглтон :(. Или :) ? Не знаю