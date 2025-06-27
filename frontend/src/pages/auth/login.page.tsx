import LoginForm from '../../features/auth/ui/login/login.form'
import IStyles from  '../../index.module.css'
import styles from './auth.page.module.scss'

const LoginPage = () => {
    return (
        <>
            <div className={IStyles.container}>
                <div className={styles.authLayout}>
                    <LoginForm/>
                </div>
            </div>
        </>
    )
}

export default LoginPage