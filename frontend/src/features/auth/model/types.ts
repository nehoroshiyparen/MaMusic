import { User } from "../api/types/User.interface"

export interface AuthState {
    user: User | null
    isAuthnticated: boolean
    loading: boolean
    error: string | null
}