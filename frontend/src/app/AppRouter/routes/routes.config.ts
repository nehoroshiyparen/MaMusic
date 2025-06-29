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