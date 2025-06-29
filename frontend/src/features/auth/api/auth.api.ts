import api from '../../../api/axiosInstance'
import { ApiResponse } from '../../../api/types/ApiResponse.interface'
import { User } from './types/User.interface'

export class AuthAPI {
    async register(username: string, email: string, password: string): Promise<ApiResponse<User>> {
        const response = await api.post<ApiResponse<User>>('/auth/register', { username, email, password })
        return response.data
    }

    async login(identifier: string, password: string): Promise<ApiResponse<User>> {
        const respose = await api.post<ApiResponse<User>>('auth/login', { identifier, password })
        return respose.data
    }

    async authMe(): Promise<ApiResponse<User | null>> {
        const response = await api.get<ApiResponse<User | null>>('/auth/me')
        return response.data
    }
}