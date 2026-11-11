import { useState } from 'react';
import { Input } from '../Input';
import EyePassword from '../../../assets/icons/EyePassword.svg?react';
import type { InputProps } from '../../../types/index';
import styles from './PasswordInput.module.css';

type PasswordInputProps = Omit<
  InputProps,
  'type' | 'leftIcon' | 'clear' | 'rightIcon'
>;

export const PasswordInput = ({
  value,
  onChange,
  label = 'Пароль',
  placeholder = 'Введите пароль',
  error = false,
  errorMessage,
  helperText,
  className = '',
  disabled = false
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <Input
        value={value}
        onChange={onChange}
        label={label}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        error={error}
        errorMessage={errorMessage}
        helperText={helperText}
        containerClassName={styles.formContainer}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            className={styles.eyeButton}
          >
            <EyePassword />
          </button>
        }
        disabled={disabled}
      />
    </div>
  );
};