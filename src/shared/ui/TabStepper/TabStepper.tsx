import styles from './TabStepper.module.css'

export interface TabStepperProps {
  total: number
  current: number
  className?: string
}

function normalize(total: number, current: number) {
  const safeTotal = Number.isFinite(total) ? Math.max(1, Math.floor(total)) : 1
  const safeCurrent = Number.isFinite(current)
    ? Math.min(Math.max(1, Math.floor(current)), safeTotal)
    : 1
  return { safeTotal, safeCurrent }
}

export function TabStepper({ total, current, className }: TabStepperProps) {
  const { safeTotal, safeCurrent } = normalize(total, current)
  const classNames = [styles.stepper, className].filter(Boolean).join(' ')

  return (
    <div className={classNames}>
      <p className={styles.title}>{`Шаг ${safeCurrent} из ${safeTotal}`}</p>
      <div className={styles.bars} aria-hidden="true">
        {Array.from({ length: safeTotal }, (_, index) => (
          <span
            key={index}
            data-testid="tab-stepper-bar"
            className={index < safeCurrent ? styles.barActive : styles.bar}
          />
        ))}
      </div>
    </div>
  )
}
