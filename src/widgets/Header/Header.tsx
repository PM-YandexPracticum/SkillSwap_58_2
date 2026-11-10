import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Logotype } from '@/shared/ui/Logo/Logotype'
import { SearchInput } from '@/shared/ui/Input/SearchInput/SearchInput'
import ChevronDownIcon from '@/shared/assets/icons/ChevronDown.svg?react'
import MoonIcon from '@/shared/assets/icons/Moon.svg?react'
import styles from './Header.module.css'

export interface HeaderProps {
  /** Вызывается при отправке поиска (Enter или клик по лупе) */
  onSearch?: (query: string) => void
  /** Значение поиска, если оно хранится во внешнем состоянии */
  searchValue?: string
  onSearchChange?: (query: string) => void
  onLoginClick?: () => void
  onRegisterClick?: () => void
  /** Пока только иконка по макету, смена темы будет отдельной задачей */
  onThemeToggle?: () => void
  className?: string
}

export function Header({
  onSearch,
  searchValue,
  onSearchChange,
  onLoginClick,
  onRegisterClick,
  onThemeToggle,
  className,
}: HeaderProps) {
  const [query, setQuery] = useState('')
  const currentQuery = searchValue ?? query
  const classNames = [styles.header, className].filter(Boolean).join(' ')

  const handleQueryChange = (value: string) => {
    setQuery(value)
    onSearchChange?.(value)
  }

  return (
    <header className={classNames}>
      <Logotype />

      <nav className={styles.menu} aria-label="Основное меню">
        <span>О проекте</span>
        <span className={styles.dropdown}>
          Все навыки
          <ChevronDownIcon aria-hidden="true" />
        </span>
      </nav>

      <SearchInput
        className={styles.search}
        value={currentQuery}
        onChange={handleQueryChange}
        onSearch={(value) => onSearch?.(value)}
      />

      <button
        type="button"
        className={styles.themeButton}
        aria-label="Переключить тему"
        onClick={onThemeToggle}
      >
        <MoonIcon aria-hidden="true" />
      </button>

      <div className={styles.buttons}>
        <Button variant="secondary" onClick={onLoginClick}>
          Войти
        </Button>
        <Button onClick={onRegisterClick}>Зарегистрироваться</Button>
      </div>
    </header>
  )
}
