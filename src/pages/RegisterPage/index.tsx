import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { Logotype } from '@/shared/ui/Logo/Logotype'
import { CloseButton } from '@/shared/ui/CloseButton'
import { TabStepper } from '@/shared/ui/TabStepper'
import { AuthButton } from '@/shared/ui/AuthButton'
import { Divider } from '@/shared/ui/Divider'
import { EmailInput } from '@/shared/ui/Input/EmailInput/EmailInput'
import { PasswordInput } from '@/shared/ui/Input/PasswordInput/PasswordInput'
import { Button } from '@/shared/ui/Button'
import lightBulb from '@/shared/assets/images/LightBulb.svg'
import styles from './RegisterPage.module.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleClose = () => {
    // если страницу открыли напрямую, возвращать некуда — ведём на главную
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate(ROUTES.HOME)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate(ROUTES.REGISTER_STEP_2)
    // переход на шаг 2 добавим, когда будут готовы роуты шагов
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Logotype onClick={() => navigate(ROUTES.HOME)} />
        <CloseButton onClick={handleClose} />
      </header>

      <div className={styles.stepper}>
        <TabStepper total={3} current={1} />
      </div>

      <main className={styles.content}>
        <section className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit}>
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
                <EmailInput value={email} onChange={setEmail} />
                <PasswordInput value={password} onChange={setPassword} />
              </div>
            </div>

            <div className={styles.actions}>
              <Button type="submit" className={styles.submit}>
                Далее
              </Button>
              <Link to={ROUTES.LOGIN} className={styles.loginLink}>
                Уже есть аккаунт? Войти
              </Link>
            </div>
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
