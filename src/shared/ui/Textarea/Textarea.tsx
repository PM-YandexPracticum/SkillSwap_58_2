import { forwardRef, useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import styles from './Textarea.module.css'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, id, className, ...props }, ref) => {
    const generatedId = useId()
    const fieldId = id ?? generatedId
    const messageId = `${fieldId}-message`
    const message = error ?? hint

    const wrapperClass = className ? `${styles.wrapper} ${className}` : styles.wrapper
    const fieldClass = error ? `${styles.field} ${styles.fieldError}` : styles.field
    const messageClass = error ? `${styles.message} ${styles.messageError}` : styles.message

    return (
      <div className={wrapperClass}>
        {label && (
          <label htmlFor={fieldId} className={styles.label}>
            {label}
          </label>
        )}
        <textarea
          id={fieldId}
          ref={ref}
          className={fieldClass}
          aria-invalid={!!error}
          aria-describedby={message ? messageId : undefined}
          {...props}
        />
        {message && (
          <span id={messageId} className={messageClass}>
            {message}
          </span>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
