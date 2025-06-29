import { useNavigate } from 'react-router-dom'
import LoginForm from '../../features/auth/ui/login/login.form'
import IStyles from  '../../index.module.css'
import styles from './auth.page.module.scss'
import { getContainer } from 'src/features/auth/di/container'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { selectAuthError } from 'src/features/auth/model/selectors'
import { useEffect } from 'react'
import { showError } from 'shared/utils/handlers/toastHandlers/ShowError'
import { clearAuthError } from 'src/features/auth/model/slice'

const LoginPage = () => {
    const navigate = useNavigate()

    const container = getContainer()
    const authService = container.getAuthService()

    const dispatch = useAppDispatch()
    const error = useAppSelector(selectAuthError)

    const submit = async(identifier: string, password: string) => {
        const response = await authService.login(identifier, password)
        if (response) {
            navigate('/')
        }
    }

    useEffect(() => {
        if (error) {
            showError(error)
            dispatch(clearAuthError())
        }
    }, [error])

    return (
        <>
            <div className={IStyles.container}>
                <div className={styles.authLayout}>
                    <LoginForm onSubmit={submit}/>
                </div>
            </div>
        </>
    )
}

export default LoginPage