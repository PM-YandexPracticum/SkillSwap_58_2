import { useEffect, useRef, useState } from 'react'
import { Button } from '../Button/Button'
import { DayPicker, DropdownProps } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format } from 'date-fns'
import { DateInput } from '../Input/DateInput/DateInput'
import styles from './DatePicker.module.css'
import { ru } from 'react-day-picker/locale'
import { Select } from '../Select/Select'

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

export const DatePickerComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null)
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
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <div ref={containerRef} className={styles.container}>
      <DateInput
        value={inputValue}
        label="Дата рождения"
        onChange={(value: string) => {
          setInputValue(value)
        }}
        onClick={() => {
          if (!isOpen) setIsOpen(true)
          else setIsOpen(false)
        }}
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
                onClick={() => {
                  if (!isOpen) return
                  if (containerRef.current) {
                    setIsOpen(false)
                  }
                }}
              >
                {'Отменить'}
              </Button>
              <Button
                onClick={() => {
                  if (!isOpen) return
                  if (containerRef.current) {
                    setIsOpen(false)
                  }
                  if (!selectedDate) {
                    return
                  } else {
                    setMonth(selectedDate)
                    setInputValue(format(selectedDate, 'dd.MM.yyyy'))
                  }
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
  )
}
