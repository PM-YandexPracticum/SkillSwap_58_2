import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'
import { Logotype } from '@/shared/ui/Logo/Logotype'
import { Avatar } from '@/shared/ui/Avatar'
import { SearchInput } from '@/shared/ui/Input/SearchInput/SearchInput'
import { SkillsModal } from '@/shared/ui/SkillsModal/SkillsModal'
import { ROUTES } from '@/shared/lib/constants'
import ChevronDownIcon from '@/shared/assets/icons/ChevronDown.svg?react'
import MoonIcon from '@/shared/assets/icons/Moon.svg?react'
import NotificationIcon from '@/shared/assets/icons/Notification.svg?react'
import LikeIcon from '@/shared/assets/icons/Like.svg?react'
import LogoutIcon from '@/shared/assets/icons/Logout.svg?react'
import IdeaIcon from '@/shared/assets/icons/Idea.svg?react'
import styles from './Header.module.css'

export interface HeaderUser {
  name: string
  avatar?: string
}

export interface HeaderNotification {
  id: string
  text: string
  description?: string
  createdAt: string
  isRead: boolean
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
  /** Список уведомлений под колокольчиком */
  notifications?: HeaderNotification[]
  onReadAllNotifications?: () => void
  onClearNotifications?: () => void
  onFavoritesClick?: () => void
  /** Подсветить сердечко, когда открыта страница избранного */
  isFavoritesActive?: boolean
  onProfileClick?: () => void
  onLogoutClick?: () => void
  className?: string
}

const DAY_MS = 24 * 60 * 60 * 1000

/** «сегодня», «вчера» или «23 мая» — как в макете */
const formatDate = (iso: string) => {
  const date = new Date(iso)
  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime()
  const daysAgo = Math.round((startOfDay(new Date()) - startOfDay(date)) / DAY_MS)

  if (daysAgo === 0) return 'сегодня'
  if (daysAgo === 1) return 'вчера'
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

/** Закрывает выпадашку по клику вне её и по Escape */
function useDismiss(isOpen: boolean, ref: React.RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) close()
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, ref, close])
}

function NotificationList({ items }: { items: HeaderNotification[] }) {
  return (
    <ul className={styles.notificationsList}>
      {items.map((item) => (
        <li key={item.id} className={styles.notification}>
          <IdeaIcon className={styles.notificationIcon} aria-hidden="true" />
          <div className={styles.notificationBody}>
            <p className={styles.notificationText}>{item.text}</p>
            {item.description && (
              <p className={styles.notificationDescription}>{item.description}</p>
            )}
          </div>
          <time className={styles.notificationTime} dateTime={item.createdAt}>
            {formatDate(item.createdAt)}
          </time>
        </li>
      ))}
    </ul>
  )
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
  notifications = [],
  onReadAllNotifications,
  onClearNotifications,
  onFavoritesClick,
  isFavoritesActive = false,
  onProfileClick,
  onLogoutClick,
  className,
}: HeaderProps) {
  const [query, setQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isSkillsOpen, setIsSkillsOpen] = useState(false)
  const userRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const skillsButtonRef = useRef<HTMLButtonElement>(null)
  const currentQuery = searchValue ?? query
  const classNames = [styles.header, className].filter(Boolean).join(' ')
  const newNotifications = notifications.filter((item) => !item.isRead)
  const viewedNotifications = notifications.filter((item) => item.isRead)
  const hasUnread = newNotifications.length > 0

  useDismiss(isMenuOpen, userRef, () => setIsMenuOpen(false))
  useDismiss(isNotificationsOpen, notificationsRef, () => setIsNotificationsOpen(false))

  const handleQueryChange = (value: string) => {
    setQuery(value)
    onSearchChange?.(value)
  }

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
          <div className={styles.notifications} ref={notificationsRef}>
            <button
              type="button"
              className={`${styles.iconButton} ${styles.bellButton}`}
              aria-label={hasUnread ? 'Уведомления, есть новые' : 'Уведомления'}
              aria-haspopup="dialog"
              aria-expanded={isNotificationsOpen}
              onClick={() => {
                setIsNotificationsOpen((prev) => !prev)
                onNotificationsClick?.()
              }}
            >
              <NotificationIcon aria-hidden="true" />
              {hasUnread && <span className={styles.badge} data-testid="notifications-badge" />}
            </button>

            {isNotificationsOpen && (
              <div className={styles.notificationsMenu} role="dialog" aria-label="Уведомления">
                {notifications.length === 0 && (
                  <p className={styles.notificationsEmpty}>Новых уведомлений нет</p>
                )}

                {newNotifications.length > 0 && (
                  <section className={styles.notificationsSection}>
                    <div className={styles.notificationsHeader}>
                      <h2 className={styles.notificationsTitle}>Новые уведомления</h2>
                      <button
                        type="button"
                        className={styles.textButton}
                        onClick={onReadAllNotifications}
                      >
                        Прочитать все
                      </button>
                    </div>
                    <NotificationList items={newNotifications} />
                  </section>
                )}

                {viewedNotifications.length > 0 && (
                  <section className={styles.notificationsSection}>
                    <div className={styles.notificationsHeader}>
                      <h2 className={styles.notificationsTitle}>Просмотренные</h2>
                      <button
                        type="button"
                        className={styles.textButton}
                        onClick={onClearNotifications}
                      >
                        Очистить
                      </button>
                    </div>
                    <NotificationList items={viewedNotifications} />
                  </section>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            className={
              isFavoritesActive
                ? `${styles.iconButton} ${styles.iconButtonActive}`
                : styles.iconButton
            }
            aria-label="Избранное"
            aria-current={isFavoritesActive ? 'page' : undefined}
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
        <Link to={ROUTES.ABOUT}>О проекте</Link>
        <div className={styles.skillsWrapper}>
          <button
            ref={skillsButtonRef}
            type="button"
            className={styles.navLink}
            onClick={() => setIsSkillsOpen((prev) => !prev)}
            aria-expanded={isSkillsOpen}
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

      <SkillsModal
        isOpen={isSkillsOpen}
        onClose={() => setIsSkillsOpen(false)}
        anchorRef={skillsButtonRef}
      />
    </header>
  )
}
