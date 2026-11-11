import { Input } from '../Input'
import type { InputProps } from '../../../types/index'
import styles from './EmailInput.module.css'

type EmailInputProps = Omit<InputProps, 'type' | 'leftIcon' | 'clear'>;

export const EmailInput = ({
  value,
  onChange,
  label = 'Email',
  placeholder = 'Введите email',
  error = false,
  errorMessage,
  helperText,
  className = '',
  rightIcon,
  disabled = false,
}: EmailInputProps) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <Input
        value={value}
        onChange={onChange}
        label={label}
        type="email"
        placeholder={placeholder}
        error={error}
        errorMessage={errorMessage}
        helperText={helperText}
        clear={value.length > 0}
        containerClassName={styles.formContainer}
        rightIcon={rightIcon}
        disabled={disabled}
      />
    </div>
  )
}
