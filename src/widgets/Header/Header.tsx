import { useEffect, useRef, useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Logotype } from '@/shared/ui/Logo/Logotype'
import { Avatar } from '@/shared/ui/Avatar'
import { SearchInput } from '@/shared/ui/Input/SearchInput/SearchInput'
import ChevronDownIcon from '@/shared/assets/icons/ChevronDown.svg?react'
import MoonIcon from '@/shared/assets/icons/Moon.svg?react'
import NotificationIcon from '@/shared/assets/icons/Notification.svg?react'
import LikeIcon from '@/shared/assets/icons/Like.svg?react'
import LogoutIcon from '@/shared/assets/icons/Logout.svg?react'
import styles from './Header.module.css'

export interface HeaderUser {
  name: string
  avatar?: string
}

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
  /** Авторизованный пользователь. Если не передан — показываются кнопки входа и регистрации */
  user?: HeaderUser | null
  onNotificationsClick?: () => void
  onFavoritesClick?: () => void
  onProfileClick?: () => void
  onLogoutClick?: () => void
  onSkillsClick?: () => void
  skillsButtonRef?: React.RefObject<HTMLButtonElement>
  className?: string
}

export function Header({
  onSearch,
  searchValue,
  onSearchChange,
  onLoginClick,
  onRegisterClick,
  onThemeToggle,
  user,
  onNotificationsClick,
  onFavoritesClick,
  onProfileClick,
  onLogoutClick,
  onSkillsClick,
  skillsButtonRef,
  className,
}: HeaderProps) {
  const [query, setQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const userRef = useRef<HTMLDivElement>(null)
  const currentQuery = searchValue ?? query
  const classNames = [styles.header, className].filter(Boolean).join(' ')

  const handleQueryChange = (value: string) => {
    setQuery(value)
    onSearchChange?.(value)
  }

  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (!userRef.current?.contains(event.target as Node)) setIsMenuOpen(false)
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen])

  const icons = (
    <div className={styles.icons}>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Переключить тему"
        onClick={onThemeToggle}
      >
        <MoonIcon aria-hidden="true" />
      </button>
      {user && (
        <>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Уведомления"
            onClick={onNotificationsClick}
          >
            <NotificationIcon aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Избранное"
            onClick={onFavoritesClick}
          >
            <LikeIcon aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  )

  return (
    <header className={classNames}>
      <Logotype />

      <nav className={styles.menu} aria-label="Основное меню">
        <span>О проекте</span>

        <div className={styles.skillsWrapper}>
          <button
            ref={skillsButtonRef}
            type="button"
            className={styles.navLink}
            onClick={onSkillsClick}
            aria-expanded={false}
          >
            Все навыки
            <ChevronDownIcon aria-hidden="true" />
          </button>
        </div>
      </nav>

      <SearchInput
        className={styles.search}
        value={currentQuery}
        onChange={handleQueryChange}
        onSearch={(value) => onSearch?.(value)}
      />

      {user ? (
        <div className={styles.actions}>
          {icons}
          <div className={styles.user} ref={userRef}>
            <button
              type="button"
              className={styles.userButton}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span>{user.name}</span>
              <Avatar src={user.avatar} alt={user.name} size={48} />
            </button>

            {isMenuOpen && (
              <div className={styles.userMenu} role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className={styles.menuItem}
                  onClick={() => {
                    setIsMenuOpen(false)
                    onProfileClick?.()
                  }}
                >
                  Личный кабинет
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className={styles.menuItem}
                  onClick={() => {
                    setIsMenuOpen(false)
                    onLogoutClick?.()
                  }}
                >
                  Выйти из аккаунта
                  <LogoutIcon aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {icons}
          <div className={styles.buttons}>
            <Button variant="secondary" onClick={onLoginClick}>
              Войти
            </Button>
            <Button onClick={onRegisterClick}>Зарегистрироваться</Button>
          </div>
        </>
      )}
    </header>
  )
}