import React from "react"
import { Navigate } from "react-router-dom"
import { selectIsAuthenticated } from "src/features/auth/model/selectors"
import { useAppSelector } from "src/store/hooks"

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated)

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default PrivateRoute