import { type ReactNode, type ButtonHTMLAttributes } from 'react'
import styles from './LinkButton.module.css'
import ChevronIcon from '../../assets/icons/Chevron.svg?react'

export interface LinkButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  children: ReactNode
  isOpen?: boolean
  onClick?: () => void
}

export const LinkButton = ({
  children,
  isOpen = false,
  onClick,
  className,
  disabled,
  ...props
}: LinkButtonProps) => {
  return (
    <button
      type="button"
      className={`${styles.linkButton} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-expanded={isOpen}
      {...props}
    >
      <span className={styles.text}>{children}</span>
      <span className={`${styles.iconWrapper} ${isOpen ? styles.iconOpen : ''}`}>
        <ChevronIcon aria-hidden="true" />
      </span>
    </button>
  )
}