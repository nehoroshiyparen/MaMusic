import { useEffect, useState } from 'react'
import authService from '../../features/auth/services/auth.service'
import RegisterForm from '../../features/auth/ui/register/register.form'
import IStyles from  '../../index.module.css'
import styles from './auth.page.module.scss'
import { showError } from 'shared/components/toast/ShowError'

const RegisterPage = () => {
    const [apiError, setApiError] = useState('')
    const [error, setError] = useState('')

    const submit = async(username: string, email: string, password: string) => {
        try {
            const response = await authService.register(username, email, password)
            return response
        } catch (e: any) {
            const error = e.response.data.message

            setApiError(error)
            showError(error)
        }
    }

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