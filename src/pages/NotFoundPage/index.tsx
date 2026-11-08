import { Button } from '@/shared/ui/Button'
import Error from './Error404.svg?react'
import styles from './NotFound.module.css'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/')
  }
  return (
    <main>
      <div className={styles.notFoundPage}>
        <div className={styles.content}>
          <Error />
          <div className={styles.mainContent}>
            <div className={styles.textContainer}>
              <h1>Страница не найдена</h1>
              <p>
                К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте
                позже
              </p>
            </div>
            <div className={styles.buttonContainer}>
              <Button className={styles.button} type="button" variant="secondary">
                {'Сообщить об ошибке'}
              </Button>
              <Button className={styles.button} onClick={handleClick} type="button">
                {'На главную'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
