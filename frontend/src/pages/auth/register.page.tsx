import RegisterForm from '../../features/auth/ui/register/register.form'
import IStyles from  '../../index.module.css'
import styles from './auth.page.module.scss'
import { showError } from 'shared/utils/handlers/toastHandlers/ShowError'
import { useNavigate } from 'react-router-dom'
import { getContainer } from 'src/features/auth/di/container'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { selectAuthError } from 'src/features/auth/model/selectors'
import { useEffect } from 'react'
import { clearAuthError } from 'src/features/auth/model/slice'

const RegisterPage = () => {
    const navigate = useNavigate()
    
    const container = getContainer()
    const authService = container.getAuthService()

    const dispatch = useAppDispatch()
    const error = useAppSelector(selectAuthError)

    const submit = async(username: string, email: string, password: string) => {
        const result = await authService.register(username, email, password)
        if (result) {
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
                    <RegisterForm onSubmit={submit}/>
                </div>
            </div>
        </>
    )
}

export default RegisterPage