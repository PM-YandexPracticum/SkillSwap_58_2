import { type ReactNode, type ButtonHTMLAttributes, useState } from 'react'
import styles from './LinkButton.module.css'
import ChevronIcon from '../../assets/icons/Chevron.svg?react'

export interface LinkButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  children: ReactNode
  isOpen?: boolean
  onClick?: () => void
}

export const LinkButton = ({
  children,
  isOpen: controlledIsOpen,
  onClick,
  className,
  disabled,
  ...props
}: LinkButtonProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen

  const handleClick = () => {
    if (disabled) return
    if (!isControlled) {
      setInternalIsOpen((prev) => !prev)
    }
    onClick?.()
  }

  return (
    <button
      type="button"
      className={`${styles.linkButton} ${className || ''}`}
      onClick={handleClick}
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