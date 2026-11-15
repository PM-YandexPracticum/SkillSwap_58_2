import type { CSSProperties } from 'react'
import styles from './Loader.module.css'

export interface LoaderProps {
  size?: number
  label?: string
  className?: string
}

const DEFAULT_SIZE = 80

export function Loader({ size = DEFAULT_SIZE, label = 'Загрузка', className }: LoaderProps) {
  const classNames = [styles.loader, className].filter(Boolean).join(' ')

  return (
    <div
      className={classNames}
      style={{ '--loader-size': `${size}px` } as CSSProperties}
      role="status"
      aria-label={label}
    />
  )
}
