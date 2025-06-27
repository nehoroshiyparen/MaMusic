import { Link } from 'react-router-dom'
import styles from '../auth.form.module.scss'
import { YandexSvg, GoogleSvg } from 'shared/components/svg/companies'
import { UserSvg, EmailSvg, PasswordSvg, VisibleSvg } from 'shared/components/svg/icons'
import { useState } from 'react'

type Props = {
    onSubmit: (username: string, email: string, password: string) => Promise<any>
}

const RegisterForm: React.FC<Props> = ({
    onSubmit
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const toggleVisibility = () => {
        setIsPasswordVisible(prev => !prev)
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit(username, email, password)
    } 

    return (
        <>
            <div className={styles.authFormWrapper}>
                <form className={styles.authForm} onSubmit={handleSubmit}>
                    <div className={styles.formLabel}>
                        Регистрация
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
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={`${styles.emailForm} ${styles.form}`}>
                        <label className={styles.label}>
                            Почта
                        </label>
                        <div className={styles.inputForm}>
                            <EmailSvg/>
                            <input 
                                className={styles.input} 
                                placeholder='Укажите вашу почту' 
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            <button onClick={toggleVisibility} type='button'>
                                <VisibleSvg/>
                            </button>
                        </div>
                    </div>
                    <button className={styles.submitButton} type='submit'>
                        Зарегистрироваться
                    </button>
                    <div className={styles.hint}>
                        <span className={styles.commonFont}>Уже зарегистрированы? <Link to={'../login'}>Войдите</Link></span>
                    </div>
                    <div className={styles.additionalWays}>
                        <button className={styles.authWay} type='button'>
                            <GoogleSvg/>
                            <span>Google</span>
                        </button>
                        <button className={styles.authWay} type='button'>
                            <YandexSvg/>
                            <span>Yandex</span>
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default RegisterForm