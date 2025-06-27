import { Navigate, Route, Routes } from "react-router-dom"
import { appRoutes } from "./routes.config"

export const AppRouter = () => {
    return (
        <Routes>
            {appRoutes.map(route => {
                return <Route key={route.path} path={route.path} element={<route.element/>}/>
            })}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}