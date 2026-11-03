import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Button } from '../Button'
import styles from './Toast.module.css'

export interface ToastProps {
  children: ReactNode
  /** Вызывается при клике на крестик и по истечении времени */
  onClose: () => void
  /** Через сколько миллисекунд тост исчезнет сам. 0 — не исчезает */
  duration?: number
  /** Текст кнопки действия. Если не передан, кнопки нет */
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function Toast({
  children,
  onClose,
  duration = 5000,
  actionLabel,
  onAction,
  className,
}: ToastProps) {
  useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const classNames = [styles.toast, className].filter(Boolean).join(' ')

  return (
    <div className={classNames} role="status">
      <p className={styles.text}>{children}</p>

      {actionLabel && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}

      <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3 3l10 10M13 3L3 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}
