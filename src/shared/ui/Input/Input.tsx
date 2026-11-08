import type { InputProps } from '@/shared/types'
import { useRef } from 'react'
import styles from './Input.module.css'

export const Input = ({
  value,
  onChange,
  label,
  placeholder = '',
  type = 'text',
  clear = false,
  error = false,
  errorMessage,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  disabled = false,
}: InputProps & { containerClassName?: string }) => {
  
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div className={`${styles.wrapper} ${className}`}>

      {label && <label className={styles.label}>{label}</label>}

      <div className={`${styles.container} ${containerClassName} ${error ? styles.error : ''}`}>
        {leftIcon && (
          <span className={styles.leftIcon}>
            {leftIcon}
          </span>
        )}

        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={styles.input}
          disabled={disabled}
        />

        {rightIcon && (
          <span className={styles.rightIcon}>
            {rightIcon}
          </span>
        )}

        {clear && value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="Очистить поле"
          >
            ×
          </button>
        )}
      </div>

      {(error && errorMessage) || helperText ? (
        <span className={`${styles.helperText} ${error ? styles.errorText : ''}`}>
          {error ? errorMessage : helperText}
        </span>
      ) : null}

    </div>
  )
}
