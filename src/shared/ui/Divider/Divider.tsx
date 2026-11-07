import styles from './Divider.module.css'

export interface DividerProps {
  className?: string
}

export function Divider({ className }: DividerProps) {
  const classNames = [styles.divider, className].filter(Boolean).join(' ')

  return <div role="separator" className={classNames} />
}
