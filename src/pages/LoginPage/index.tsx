// TODO: реализовать страницу LoginPage

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { Logotype } from '@/shared/ui/Logo/Logotype'
import { CloseButton } from '@/shared/ui/CloseButton'
import { AuthButton } from '@/shared/ui/AuthButton'
import { Divider } from '@/shared/ui/Divider'
import { EmailInput } from '@/shared/ui/Input/EmailInput/EmailInput'
import { PasswordInput } from '@/shared/ui/Input/PasswordInput/PasswordInput'
import { Button } from '@/shared/ui/Button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  clearAuthError,
  login,
  selectAuthError,
  selectAuthStatus,
} from '@/features/auth/model/authSlice'
import type { LoginCredentials } from '@/features/auth/model/authSlice'
import lightBulb from '@/shared/assets/images/LightBulb.svg'
import styles from './LoginPage.module.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const authError = useAppSelector(selectAuthError)
  const authStatus = useAppSelector(selectAuthStatus)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({ defaultValues: { email: '', password: '' } })

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  const goBack = () => {
    // если пользователь открыл /login напрямую, возвращать некуда — ведём на главную
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate(ROUTES.HOME)
    }
  }

  const redirectAfterLogin = () => {
    // если на вход отправил PrivateRoute, возвращаем на ту страницу, куда шёл пользователь
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname
    if (from) {
      navigate(from, { replace: true })
    } else {
      goBack()
    }
  }

  const onSubmit = async (data: LoginCredentials) => {
    const result = await dispatch(login(data))
    if (login.fulfilled.match(result)) redirectAfterLogin()
  }

  const resetAuthError = () => {
    if (authError) dispatch(clearAuthError())
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Logotype onClick={() => navigate(ROUTES.HOME)} />
        <CloseButton onClick={goBack} />
      </header>

      <main className={styles.content}>
        <section className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={styles.fields}>
              <div className={styles.providers}>
                <AuthButton provider="google" className={styles.provider}>
                  Продолжить с Google
                </AuthButton>
                <AuthButton provider="apple" className={styles.provider}>
                  Продолжить с Apple
                </AuthButton>
              </div>

              <Divider label="или" />

              <div className={styles.inputs}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Введите email',
                    pattern: { value: EMAIL_PATTERN, message: 'Некорректный email' },
                  }}
                  render={({ field }) => (
                    <EmailInput
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value)
                        resetAuthError()
                      }}
                      error={Boolean(errors.email) || Boolean(authError)}
                      errorMessage={errors.email?.message}
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: 'Введите пароль' }}
                  render={({ field }) => (
                    <PasswordInput
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value)
                        resetAuthError()
                      }}
                      error={Boolean(errors.password) || Boolean(authError)}
                      errorMessage={errors.password?.message}
                    />
                  )}
                />
                {authError && (
                  <p className={styles.error} role="alert">
                    {authError}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className={styles.submit} disabled={authStatus === 'loading'}>
              Войти
            </Button>
          </form>
        </section>

        <section className={`${styles.card} ${styles.welcome}`}>
          <img src={lightBulb} alt="" className={styles.illustration} />
          <div className={styles.text}>
            <h1 className={styles.title}>Добро пожаловать в SkillSwap!</h1>
            <p className={styles.description}>
              Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
