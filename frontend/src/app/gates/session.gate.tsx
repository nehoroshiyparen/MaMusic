import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContainer } from "src/features/auth/di/container";
import { selectAuthIsLoading } from "src/features/auth/model/selectors";
import {  useAppSelector } from "src/store/hooks";

const SessionGate = ({ children }: { children: ReactNode }) => {
    const DIContainer = getContainer()
    const authService = DIContainer.getAuthService()

    const navigate = useNavigate()

    const loading = useAppSelector(selectAuthIsLoading)

    useEffect(() => {
        const authenticate = async() => {
            const response = await authService.authMe()

            console.log(response)

            if (!response) {
                navigate('/login')
            }
        }
        
        authenticate()
    }, [])

    if (loading) return 

    return <>{children}</>
}

export default SessionGate