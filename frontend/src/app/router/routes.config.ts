import RegisterPage from '../../pages/auth/register.page'
import LoginPage from '../../pages/auth/login.page'

export const appRoutes: {
    path: string,
    element: any,
    protected: boolean
}[] = [
    {
        path: '/register',
        element: RegisterPage,
        protected: false
    },
    {
        path: '/login',
        element: LoginPage,
        protected: false
    }
]