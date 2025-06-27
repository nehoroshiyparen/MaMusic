import api from '../../../api/axiosInstance'
import { ApiResponse } from '../../../api/types/ApiResponse.interface'
import { User } from './types/User.interface'

export const authApi = {
    register: async(username: string, email: string, password: string): Promise<ApiResponse<User>> => {
        const response = await api.post<ApiResponse<User>>('/auth/register', { username, email, password })
        return response.data
    },
}