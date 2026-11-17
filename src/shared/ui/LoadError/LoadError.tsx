import styles from './LoadError.module.css'

export function LoadError({ message }: { message: string }) {
  return (
    <p className={styles.error} role="alert">
      {message}
    </p>
  )
}
