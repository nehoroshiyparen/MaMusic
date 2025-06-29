import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getContainer } from "src/features/auth/di/container";
import { selectAuthIsLoading } from "src/features/auth/model/selectors";
import {  useAppSelector } from "src/store/hooks";
import { publicRoutes } from "../AppRouter/routes/routes.config";

const SessionGate = ({ children }: { children: ReactNode }) => {
    const DIContainer = getContainer()
    const authService = DIContainer.getAuthService()

    const navigate = useNavigate()
    const path = useLocation()

    const [isAuthenticated, ] = useState(async() => {
        return !!(await authService.authMe())
    })

    const loading = useAppSelector(selectAuthIsLoading)
    const isPublicRoute = publicRoutes.some(route => route.path === path.pathname)

    useEffect(() => {
        if (!isAuthenticated && !isPublicRoute) {
                navigate('/login')
            }
    }, [isAuthenticated])

    if (loading) return 

    return <>{children}</>
}

export default SessionGate