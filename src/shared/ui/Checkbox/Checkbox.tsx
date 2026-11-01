import { useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode } from 'react'

import styles from './Checkbox.module.css'
import CheckboxEmptyIcon from '../../assets/icons/CheckboxEmpty.svg?react'
import CheckboxDoneIcon from '../../assets/icons/CheckboxDone.svg?react'
import CheckboxRemoveIcon from '../../assets/icons/CheckboxRemove.svg?react'

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: ReactNode
  indeterminate?: boolean
}

export function Checkbox({
  label,
  id,
  indeterminate = false,
  className,
  checked,
  disabled,
  ...props
}: CheckboxProps) {
  const autoId = useId()
  const checkboxId = id ?? autoId
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

 
  const wrapperClasses = [
    styles.wrapper,
    className,
    disabled ? styles.disabled : ''
  ].filter(Boolean).join(' ')

  let icon = <CheckboxEmptyIcon />
  if (indeterminate) {
    icon = <CheckboxRemoveIcon />
  } else if (checked) {
    icon = <CheckboxDoneIcon />
  }

  return (
    <label htmlFor={checkboxId} className={wrapperClasses}>
      <input
        {...props}
        ref={inputRef}
        id={checkboxId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        className={styles.input}
        aria-checked={indeterminate ? 'mixed' : checked}
      />

      <span className={styles.visual} aria-hidden="true">
        {icon}
      </span>

      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}