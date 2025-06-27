import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit";
import { logout } from "../../features/auth/model/slice";
import { ApiResponse } from "../../api/types/ApiResponse.interface";
 
export const authMiddleware: Middleware = storeAPI => next => action => {
    if (isRejectedWithValue(action)) {
        const payload = action.payload as ApiResponse<void>
        
        if (payload.statusCode === 401 || payload.statusCode === 403) {
            storeAPI.dispatch(logout())
            window.location.href = '/login' 
        }
    }
    return next(action)
}