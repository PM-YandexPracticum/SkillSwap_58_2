import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../shared/lib/constants'
import { Button } from '../../shared/ui/Button'
import Error500 from './Error500.svg?react'
import styles from './ServerErrorPage.module.css'

export const ServerErrorPage = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate(ROUTES.HOME)
  }

  const handleReportError = () => {
    console.log('Сообщить об ошибке')
  }

  return (
    <div className={styles.container}>
      <div className={styles.illustration}>
        <Error500 />
      </div>

      <h1 className={styles.title}>На сервере произошла ошибка</h1>
      <p className={styles.subtitle}>Попробуйте позже или вернитесь на главную страницу</p>

      <div className={styles.actions}>
        <div className={styles.buttonWrapper}>
          <Button variant="secondary" onClick={handleReportError}>
            Сообщить об ошибке
          </Button>
        </div>
        <div className={styles.buttonWrapper}>
          <Button variant="primary" onClick={handleGoHome}>
            На главную
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ServerErrorPage
