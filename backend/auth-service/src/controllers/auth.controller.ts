import { Request, Response } from 'express'
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

        const { accessToken, refreshToken, userPayload } = await authService.register(validatedData, correlationId)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
            path: '/',
        })

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
            path: '/',
        })

        sendResponse(res, 201, 'Register complited', userPayload)
    } catch (e) {
        sendError(res, e)
    }
}

export const Login = async (req: Request, res: Response) => {
    // ... Логика входа в аккаунт

    try {
        const authService = getContainer().getAuthService()

        const validatedData = LoginDtoSchema.parse(req.body)

        const { accessToken, refreshToken, userPayload } = await authService.login(validatedData)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN)
        })

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: Number(process.env.ACCESS_TOKEN_EXPIRES_IN)
        })

        sendResponse(res, 201, 'Login complited', userPayload)
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

export const AuthMe = async (req: Request, res: Response) => {
    const authService = getContainer().getAuthService()

    try {
        const accessToken = req.cookies?.accessToken
        const refreshToken = req.cookies?.refreshToken
        const correlationId = req.headers['x-correlation-id'] as string | undefined

        const verifiedAccessToken = await authService.authMe(accessToken, refreshToken, correlationId)

        req.headers['x-user-id'] = String(verifiedAccessToken.decoded.id)
            
        if (verifiedAccessToken.accessToken) {
            res.cookie('accessToken', verifiedAccessToken.accessToken, {
                httpOnly: true,
                sameSite: 'lax',
                secure: false,
                maxAge: 1800000
            })
        }

        sendResponse(res, 200, 'Authenticated', verifiedAccessToken.decoded)
        
    } catch (e) {
        sendError(res, e)
    }
}