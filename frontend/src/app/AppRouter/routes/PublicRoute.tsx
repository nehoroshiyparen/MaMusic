import { selectIsAuthenticated } from "src/features/auth/model/selectors"
import { useAppSelector } from "src/store/hooks"
import { Navigate } from "react-router-dom"
import React from "react"

const PublicRoute = ({ children }: { children: React.ReactElement }) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated)

    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return children
}

export default PublicRoute