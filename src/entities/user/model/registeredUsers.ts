import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { UserProfile } from '@/shared/types'

/** Зарегистрированный пользователь: профиль как в users.json + логин и пароль */
export type RegisteredUser = UserProfile & { login: string; password: string }

export function getRegisteredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS)
    return raw ? (JSON.parse(raw) as RegisteredUser[]) : []
  } catch {
    return []
  }
}

export function saveRegisteredUsers(users: RegisteredUser[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users))
}

/** Профиль для каталога — без логина и пароля */
export function toProfile({
  login: _login,
  password: _password,
  ...profile
}: RegisteredUser): UserProfile {
  return profile
}
