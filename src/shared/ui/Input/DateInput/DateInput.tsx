import Calendar from '../../../assets/icons/Calendar.svg?react'
import styles from './DateInput.module.css'
import { Input } from '../Input'

type DateInputProps = {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: boolean
  errorMessage?: string
  className?: string
  onClick?: () => void
}

export const DateInput = ({
  value,
  onChange,
  label = 'Дата рождения',
  error = false,
  errorMessage,
  className = '',
  onClick,
}: DateInputProps) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <Input
        className={styles.dateInput}
        value={value}
        onChange={onChange}
        label={label}
        type={'text'}
        placeholder='дд.мм.гггг'
        error={error}
        errorMessage={errorMessage}
        containerClassName={styles.formContainer}
        rightIcon={
          <button type="button" className={styles.calendarButton} onClick={onClick}>
            <Calendar />
          </button>
        }
        disabled={true}
      />
    </div>
  )
}
