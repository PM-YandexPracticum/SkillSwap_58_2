import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

export interface ExchangeNotification {
  id: string
  text: string
  description: string
  createdAt: string
  isRead: boolean
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

/** id пользователей, которым уже предложили обмен */
export const getProposedTo = () => read<number[]>(LOCAL_STORAGE_KEYS.REQUESTS, [])

export const saveProposedTo = (ids: number[]) =>
  localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS, JSON.stringify(ids))

export const getNotifications = () =>
  read<ExchangeNotification[]>(LOCAL_STORAGE_KEYS.NOTIFICATIONS, [])

export const saveNotifications = (notifications: ExchangeNotification[]) =>
  localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications))
