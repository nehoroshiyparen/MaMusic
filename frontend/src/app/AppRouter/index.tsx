import { Navigate, Route, Routes } from "react-router-dom"
import { appRoutes } from "./routes/routes.config"
import PrivateRoute from "./routes/PrivateRoute"
import PublicRoute from "./routes/PublicRoute"

export const AppRouter = () => {
    return (
        <Routes>
            {appRoutes.map(route => {
                if (route.protected) {
                    return (
                        <Route 
                            key={route.path} 
                            path={route.path} 
                            element={
                                <PrivateRoute>
                                    <route.element/>
                                </PrivateRoute>
                            }/>
                    )
                } else {
                    return (
                        <Route 
                            key={route.path} 
                            path={route.path} 
                            element={
                                <PublicRoute>
                                    <route.element/>
                                </PublicRoute>
                            }/>
                    )
                }
            })}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}