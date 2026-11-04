import { createContext, ReactNode, useId } from 'react'
import styles from './RadioGroup.module.css';

type RadioGroupContextValue = {
  name: string
  value: string
  onChange: (value: string) => void
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

interface RadioGroupProps {
  name?: string
  value: string
  onChange: (value: string) => void
  label?: string
  children: ReactNode
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name = null,
  value = '',
  onChange,
  label = null,
  children,
}) => {
  const autoId = useId()
  const groupName = name ?? autoId
  return (
    <RadioGroupContext.Provider value={{ name: groupName, value, onChange }}>
      <fieldset className={styles.radiogroup}>
        {label && <legend className={styles.description}>{label}</legend>}
        <div className={styles.radiolist}>
          {children}
        </div>
      </fieldset>
    </RadioGroupContext.Provider>
  )
}
