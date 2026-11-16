import { useEffect, useRef, useState } from 'react'
import { Button } from '../Button/Button'
import { DayPicker, DropdownProps } from 'react-day-picker'
import type { DayButtonProps } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format } from 'date-fns'
import { DateInput } from '../Input/DateInput/DateInput'
import styles from './DatePicker.module.css'
import { ru } from 'react-day-picker/locale'
import { Select } from '../Select/Select'

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void
}

const CustomSelector = (props: DropdownProps) => {
  const { options, value, onChange } = props
  const handleValueChange = (newValue: string) => {
    if (onChange) {
      const syntheticEvent = {
        target: { value: newValue },
      } as React.ChangeEvent<HTMLSelectElement>
      onChange(syntheticEvent)
    }
  }
  return (
    <Select
      className={styles.selector}
      options={
        options?.map((option) => ({
          value: String(option.value),
          label: option.label.replace(/^./, (char) => char.toUpperCase()),
        })) ?? [{ value: '', label: '' }]
      }
      value={value !== undefined && value !== null ? String(value) : ''}
      onChange={handleValueChange}
    />
  )
}

// День календаря — обычная кнопка, а не «отправить форму»:
// без type="button" клик по дню внутри <form> срабатывал как «Продолжить»
const DayButton = ({ day: _day, modifiers, ...buttonProps }: DayButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return <button ref={ref} type="button" {...buttonProps} />
}

export const DatePickerComponent = ({value = '', onChange,}: DatePickerProps) => {
  const [month, setMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const handleDayPickerSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined)
    } else {
      setSelectedDate(date)
    }
  }

  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Escape закрывает календарь. Слушатель только пока календарь открыт
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  return (
    <>
      {/* Оверлей: пока календарь открыт, клики мимо него не доходят до формы, а только закрывают календарь */}
      {isOpen && (
        <div
          className={styles.overlay}
          data-testid="date-picker-overlay"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className={isOpen ? `${styles.container} ${styles.containerOpen}` : styles.container}>
        <DateInput
          value={inputValue}
          label="Дата рождения"
          onChange={(value: string) => {
            setInputValue(value)
            onChange?.(value)
          }}
          onClick={() => setIsOpen((prev) => !prev)}
        />
        {isOpen && (
          <DayPicker
            locale={ru}
            month={month}
            captionLayout="dropdown"
            hideNavigation
            onMonthChange={setMonth}
            mode="single"
            selected={selectedDate}
            onSelect={handleDayPickerSelect}
            footer={
              <div className={styles.footer}>
                <Button
                  variant="secondary"
                  className={styles.declineButton}
                  onClick={() => setIsOpen(false)}
                >
                  {'Отменить'}
                </Button>
                <Button
                  onClick={() => {
                    setIsOpen(false)
                    if (!selectedDate) return
                    setMonth(selectedDate)
                    const formattedDate = format(selectedDate, 'dd.MM.yyyy')
                    setInputValue(formattedDate)
                    onChange?.(formattedDate)
                  }}
                  className={styles.applyButton}
                >
                  {'Выбрать'}
                </Button>
              </div>
            }
            components={{
              MonthsDropdown: CustomSelector,
              YearsDropdown: CustomSelector,
              DayButton,
            }}
            fixedWeeks
            showOutsideDays
            className={styles.calendar}
            modifiersClassNames={{
              selected: styles.selectedDay,
              today: styles.today,
            }}
          />
        )}
      </div>
    </>
  )
}