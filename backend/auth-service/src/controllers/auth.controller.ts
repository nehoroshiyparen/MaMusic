import { Request, Response } from 'express'
import { AuthService } from 'src/services/auth.service'
import { LoginDtoSchema } from 'src/dto/login.dto'
import { RegisterDtoSchema } from 'src/dto/register.dto'
import { sendResponse, sendError } from 'shared/common/utils/http'
import dotenv from 'dotenv'
import { getContainer } from 'src/di/container'

dotenv.config()

export const Register = async (req: Request, res: Response) => {
    // ... Логика регистрации

    try {
        const authService = getContainer().getAuthService()

        const validatedData = RegisterDtoSchema.parse(req.body)
        const correlationId = req.headers['x-correlation-id'] as string

        const tokens = await authService.register(validatedData, correlationId)

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN)
        })

        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: Number(process.env.ACCESS_TOKEN_EXPIRES_IN)
        })

        sendResponse(res, 201, 'Register complited', null)
    } catch (e) {
        sendError(res, e)
    }
}

export const Login = async (req: Request, res: Response) => {
    // ... Логика входа в аккаунт

    try {
        const authService = getContainer().getAuthService()

        const validatedData = LoginDtoSchema.parse(req.body)

        const tokens = await authService.login(validatedData)

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN)
        })

        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: Number(process.env.ACCESS_TOKEN_EXPIRES_IN)
        })

        sendResponse(res, 201, 'Login complited', null)
    } catch (e) {
        sendError(res, e)
    }
}

export const Logout = async (req: Request, res: Response) => {
    // ... Логика выхода из аккаунта

    try {
        const authService = getContainer().getAuthService()

        await authService.logout(req.user.id)

        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(0),
        })

        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(0),
        })

        sendResponse(res, 201, 'Logout complited', null)
    } catch (e) {
        sendError(res, e)
    }
}