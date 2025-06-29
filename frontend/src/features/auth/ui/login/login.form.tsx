import { Link } from 'react-router-dom'
import styles from '../auth.form.module.scss'
import { GoogleSvg, YandexSvg } from 'shared/components/svg/companies/index'
import { PasswordSvg, VisibleSvg, UserSvg } from 'shared/components/svg/icons'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import loginResolver from '../../utils/validators/login.validator'

type Props = {
    onSubmit: (identifier: string, password: string) => Promise<void>
}

type FormData = {
    identifier: string
    password: string
}

const LoginForm: React.FC<Props> = ({
    onSubmit
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(loginResolver),
        mode: 'onSubmit'
    })

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const toggleVisibility = () => {
        setIsPasswordVisible(prev => !prev)
    }

    return (
        <>
            <div className={styles.authFormWrapper}>
                <form className={styles.authForm} onSubmit={handleSubmit(data => onSubmit(data.identifier, data.password))}>
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
                                placeholder='Укажите ваш юзернейм или почту' 
                                type='identifier'
                                {...register('identifier')}
                            />
                        </div>
                        {errors.identifier && (
                            <span className={styles.error}>
                                {errors.identifier.message}
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
                                { ...register('password') }
                            />
                            <button onClick={toggleVisibility} type="button">
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