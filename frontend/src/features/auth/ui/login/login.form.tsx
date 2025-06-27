import { Link } from 'react-router-dom'
import styles from '../auth.form.module.scss'
import { GoogleSvg, YandexSvg } from 'shared/components/svg/companies/index'
import { PasswordSvg, VisibleSvg, UserSvg } from 'shared/components/svg/icons'
import { useState } from 'react'

const LoginForm = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')

    const toggleVisibility = () => {
        setIsPasswordVisible(prev => !prev)
    }

    return (
        <>
            <div className={styles.authFormWrapper}>
                <form className={styles.authForm}>
                    <div className={styles.formLabel}>
                        Вход в аккаунт
                    </div>
                    <div className={`${styles.userForm} ${styles.form}`}>
                        <label className={styles.label}>
                            Имя пользователя
                        </label>
                        <div className={styles.inputForm}>
                            <UserSvg/>
                            <input 
                                className={styles.input} 
                                placeholder='Укажите ваш юзернейм' 
                                type='username'
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={`${styles.passwordForm} ${styles.form}`}>
                        <label className={styles.label}>
                            Пароль
                        </label>
                        <div className={styles.inputForm}>
                            <PasswordSvg/>
                            <input 
                                className={styles.input} 
                                placeholder='Укажите ваш пароль' 
                                type={isPasswordVisible ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button onClick={toggleVisibility} type="button">
                                <VisibleSvg/>
                            </button>
                        </div>
                    </div>
                    <button className={styles.submitButton} type='submit'>
                        Войти
                    </button>
                    <div className={styles.hint}>
                        <span className={styles.commonFont}>Еще нет аккаунта? <Link to={'../register'}>Зарегистрируйтесь</Link></span>
                    </div>
                    <div className={styles.additionalWays}>
                        <button className={styles.authWay} type="button">
                            <GoogleSvg/>
                            <span>Google</span>
                        </button>
                        <button className={styles.authWay} type="button">
                            <YandexSvg/>
                            <span>Yandex</span>
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default LoginForm