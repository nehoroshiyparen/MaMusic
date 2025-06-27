import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "./types";
import { User } from "../api/types/User.interface";

const initialState: AuthState = {
    user: null,
    isAuthnticated: false,
    loading:  false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true
            state.error = null
        },
        loginSuccess(state, action: PayloadAction<{ user: User }>) {
            state.loading = false
            state.user = action.payload.user
            state.isAuthnticated = true
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.loading = false
            state.error = action.payload
        },
        logout(state) {
            state.user = null
            state.isAuthnticated = false
        }
    }
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions
export default authSlice.reducer