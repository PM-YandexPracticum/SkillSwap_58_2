import { useState, useRef, useEffect } from 'react';
import styles from './Select.module.css';
import Chevron from '../../assets/icons/Chevron.svg?react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Select = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Не указан',
  className = '',
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption?.label || placeholder;

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`${styles.wrapper} ${className}`} ref={selectRef}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={`${styles.container} ${isOpen ? styles.containerOpen : ''}`}>
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={styles.triggerText}>{displayText}</span>
          <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}>
            <Chevron/>
          </span>
        </button>

        {isOpen && (
          <ul className={styles.dropdown} role="listbox">
            {options.map(option => (
              <li
                key={option.value}
                className={`${styles.option} ${option.value === value ? styles.optionSelected : ''}`}
                onClick={() => handleOptionClick(option.value)}
                role="option"
                aria-selected={option.value === value}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};