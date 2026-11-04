import { useState, useRef, useEffect } from 'react'
import styles from './MultiSelect.module.css'
import { Checkbox } from '../Checkbox'
import ChevronIcon from '../../assets/icons/Chevron.svg?react'
import type { MultiSelectProps } from './types'

export const MultiSelect = ({
  options,
  selectedIds,
  onChange,
  label,
  placeholder = 'Выберите категорию',
  className,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  const handleCheck = (id: string, isChecked: boolean) => {
    if (isChecked) {
      onChange([...selectedIds, id])
    } else {
      onChange(selectedIds.filter((selectedId) => selectedId !== id))
    }
  }

  const getTriggerText = () => {
    if (selectedIds.length === 0) return placeholder
    if (selectedIds.length === 1) {
      const selectedOption = options.find((opt) => opt.id === selectedIds[0])
      return selectedOption?.label || placeholder
    }
    return `Выбрано: ${selectedIds.length}`
  }

  const isPlaceholder = selectedIds.length === 0

  return (
    <div ref={containerRef} className={`${styles.container} ${className || ''}`}>
      {label && <span className={styles.label}>{label}</span>}
      
      <div className={`${styles.wrapper} ${isOpen ? styles.open : ''}`}>
        <button
          type="button"
          className={styles.trigger}
          onClick={handleToggle}
          aria-expanded={isOpen}
        >
          <span className={`${styles.triggerText} ${isPlaceholder ? styles.placeholder : ''}`}>
            {getTriggerText()}
          </span>
          <span className={`${styles.iconWrapper} ${isOpen ? styles.iconOpen : ''}`}>
            <ChevronIcon aria-hidden="true" />
          </span>
        </button>

        {isOpen && (
          <div className={styles.dropdown} role="listbox">
            {options.map((option) => (
              <Checkbox
                key={option.id}
                label={option.label}
                checked={selectedIds.includes(option.id)}
                onChange={(e) => handleCheck(option.id, e.target.checked)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
  }