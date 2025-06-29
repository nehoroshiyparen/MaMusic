import RegisterPage from 'src/pages/auth/register.page'
import LoginPage from 'src/pages/auth/login.page'
import HomePage from 'src/pages/home/home.page'

export const appRoutes: {
    path: string,
    element: any,
    protected: boolean
}[] = [
    {
        path: '/',
        element: HomePage,
        protected: true
    },
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

export const privateRoutes = appRoutes.filter((route) => route.protected)
export const publicRoutes = appRoutes.filter((route) => !route.protected)