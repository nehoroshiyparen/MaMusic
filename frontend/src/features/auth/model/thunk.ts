import { AppDispatch } from "../../../store";
import authService from "../services/auth.service";
import { loginFailure, loginStart, loginSuccess } from "./slice";

export const registerThunk = 
    (username: string, email: string, password: string) => 
    async (dispatch: AppDispatch) => {
        try {
            dispatch(loginStart())
            const data = await authService.register(username, email, password)
            dispatch(loginSuccess({ user: data }))
        } catch (e: any) {
            dispatch(loginFailure(e.message))
        }
    }