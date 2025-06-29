import { AppDispatch } from "src/store";
import { AuthAPI } from "../api/auth.api";
import AuthService from "../services/auth.service";
import { useDispatch } from "react-redux";

export class Container {
    private _authService: AuthService
    private _authAPI: AuthAPI
    private _dispatch: AppDispatch
    
    constructor() {
        this._dispatch = useDispatch()

        this._authAPI = new AuthAPI()
        this._authService = new AuthService(this._dispatch, this._authAPI)
    }

    public getDispatch() { return this._dispatch }
    public getAuthService() { return this._authService }
    public getAuthAPI() { return this._authAPI }

    
}