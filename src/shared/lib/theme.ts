import { LOCAL_STORAGE_KEYS } from './constants'

export type Theme = 'light' | 'dark'

export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)'

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

export function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME)
    return isTheme(value) ? value : null
  } catch {
    return null
  }
}

export function getSystemTheme(): Theme {
  return window.matchMedia?.(THEME_MEDIA_QUERY).matches ? 'dark' : 'light'
}

export function getInitialTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme()
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
}
