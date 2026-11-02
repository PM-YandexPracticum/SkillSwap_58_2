import { useContext, useId } from 'react'
import { RadioGroupContext } from './RadioGroup'
import styles from './Radio.module.css';

interface RadioProps {
  label: string
  value: string
}

export const Radio: React.FC<RadioProps> = ({ label = '', value = '' }) => {
  const id = useId()
  const ctx = useContext(RadioGroupContext)
  return (
    <label htmlFor={id} className={styles.radiobutton}>
      <input
        id={id}
        type="radio"
        name={ctx?.name}
        value={value}
        checked={ctx?.value == value}
        onChange={() => ctx?.onChange(value)}
        className={styles.hidden}
      />
      <span className={styles.pseudoradio}></span>
      <span className={styles.label}>{label}</span>
    </label>
  )
}
