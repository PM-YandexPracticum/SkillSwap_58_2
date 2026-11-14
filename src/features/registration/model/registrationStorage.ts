import { LOCAL_STORAGE_KEYS, SESSION_STORAGE_KEYS } from '@/shared/lib/constants'
import type { UserProfile } from '@/shared/types'

/** Всё, что пользователь ввёл на трёх шагах */
export interface RegistrationDraft {
  email: string
  password: string
  avatar: string
  name: string
  birthDate: string
  gender: string
  city: string
  learnCategories: string[]
  learnSubcategories: string[]
  skillName: string
  skillCategory: string
  skillSubcategory: string
  skillDescription: string
  skillImages: string[]
}

/** 0 — ничего не заполнено, 1 — пройден шаг 1, 2 — пройден шаг 2 */
export type CompletedStep = 0 | 1 | 2

export interface StoredDraft {
  draft: RegistrationDraft
  completedStep: CompletedStep
}

/** Зарегистрированный пользователь: профиль как в users.json + логин и пароль */
export type RegisteredUser = UserProfile & { login: string; password: string }

export const EMPTY_DRAFT: RegistrationDraft = {
  email: '',
  password: '',
  avatar: '',
  name: '',
  birthDate: '',
  gender: '',
  city: '',
  learnCategories: [],
  learnSubcategories: [],
  skillName: '',
  skillCategory: '',
  skillSubcategory: '',
  skillDescription: '',
  skillImages: [],
}

// Черновик живёт в sessionStorage: переживает F5, но не остаётся навсегда
export function getDraft(): StoredDraft | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEYS.REGISTRATION_DRAFT)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredDraft
    return { draft: { ...EMPTY_DRAFT, ...parsed.draft }, completedStep: parsed.completedStep }
  } catch {
    return null
  }
}

export function saveDraft(value: StoredDraft): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEYS.REGISTRATION_DRAFT, JSON.stringify(value))
  } catch {
    // если места не хватило (например, большие картинки) — просто не сохраняем черновик
  }
}

export function clearDraft(): void {
  sessionStorage.removeItem(SESSION_STORAGE_KEYS.REGISTRATION_DRAFT)
}

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
