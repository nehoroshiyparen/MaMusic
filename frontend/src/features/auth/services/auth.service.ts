import { handleApiResponse } from "shared/utils/apiHandlers/handleApiResponse";
import { AppDispatch } from "src/store";
import { loginFailure, loginSilentFailure, loginStart, loginSuccess } from "../model/slice";
import { AuthAPI } from "../api/auth.api";

class AuthService {
    constructor(
        private dispatch: AppDispatch,
        private authAPI: AuthAPI
    ) {}

    async register(username: string, email: string, password: string) {
        this.dispatch(loginStart())
        try {
            const response = await this.authAPI.register(username, email, password)
            const result = handleApiResponse(response)

            this.dispatch(loginSuccess({ user: result }))

            return result
        } catch (e: any) {
            this.dispatch(loginFailure(e.response.data.error.message))
            return null
        }
    }

    async login(identifier: string, password: string) {
        this.dispatch(loginStart())
        try {
            const response = await this.authAPI.login(identifier, password)
            const result = handleApiResponse(response)

            this.dispatch(loginSuccess({ user: result }))

            return result
        } catch (e: any) {
            this.dispatch(loginFailure(e.response.data.error.message))
        }
    }

    async authMe() {
        this.dispatch(loginStart())
        try {
            const response = await this.authAPI.authMe()
            const result = handleApiResponse(response)

            this.dispatch(loginSuccess({ user: response.data! }))

            return result
        } catch (e: any) {
            this.dispatch(loginSilentFailure())
            return null
        }
    }
}

export default AuthService