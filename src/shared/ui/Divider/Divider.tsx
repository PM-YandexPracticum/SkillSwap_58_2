import styles from './Divider.module.css'

export interface DividerProps {
  label?: string
  className?: string
}

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    const classNames = [styles.divider, className].filter(Boolean).join(' ')
    return <div role="separator" className={classNames} />
  }

  const classNames = [styles.labeled, className].filter(Boolean).join(' ')

  return (
    <div role="separator" aria-label={label} className={classNames}>
      <span className={styles.divider} />
      <span className={styles.label}>{label}</span>
      <span className={styles.divider} />
    </div>
  )
}
