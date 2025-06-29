import { Link } from 'react-router-dom'
import styles from '../auth.form.module.scss'
import { YandexSvg, GoogleSvg } from 'shared/components/svg/companies'
import { UserSvg, EmailSvg, PasswordSvg, VisibleSvg } from 'shared/components/svg/icons'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import registrationResolver from '../../utils/validators/registration.validator'

type FormData = {
    username: string
    email: string
    password: string
}

type Props = {
    onSubmit: (username: string, email: string, password: string) => Promise<any>
}

const RegisterForm: React.FC<Props> = ({
    onSubmit
}) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(registrationResolver),
        mode: 'onBlur'
    })

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    
    const toggleVisibility = () => {
        setIsPasswordVisible(prev => !prev)
    }

    return (
        <>
            <div className={styles.authFormWrapper}>
                <form className={styles.authForm} onSubmit={handleSubmit(data => {
                    onSubmit(data.username, data.email, data.password)
                })}>
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
                                {...register('username')}
                            />
                        </div>
                        {errors.username && (
                            <span className={styles.error}>
                                {errors.username.message}
                            </span>
                        )}
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
                                {...register('email')}
                            />
                        </div>
                        {errors.email && (
                            <span className={styles.error}>
                                {errors.email.message}
                            </span>
                        )}
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
                                {...register('password')}
                            />
                            <button onClick={toggleVisibility} type='button'>
                                <VisibleSvg/>
                            </button>
                        </div>
                        {errors.password && (
                            <span className={styles.error}>
                                {errors.password.message}
                            </span>
                        )}
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