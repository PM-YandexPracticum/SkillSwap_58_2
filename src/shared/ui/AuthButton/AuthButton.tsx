import type { ButtonHTMLAttributes, ReactNode } from 'react'
import GoogleIcon from '@/shared/assets/icons/Google.svg?react'
import AppleIcon from '@/shared/assets/icons/Apple.svg?react'
import styles from './AuthButton.module.css'

export type AuthProvider = 'google' | 'apple'

export interface AuthButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  provider: AuthProvider
  children: ReactNode
}

const ICONS = {
  google: GoogleIcon,
  apple: AppleIcon,
} as const

export function AuthButton({
  provider,
  children,
  type = 'button',
  className,
  ...rest
}: AuthButtonProps) {
  const Icon = ICONS[provider]
  const classNames = [styles.button, className].filter(Boolean).join(' ')

  return (
    <button type={type} className={classNames} {...rest}>
      <Icon className={styles.icon} aria-hidden="true" />
      <span>{children}</span>
    </button>
  )
}
