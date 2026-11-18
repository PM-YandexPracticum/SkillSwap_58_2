import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  applyTheme,
  getInitialTheme,
  getStoredTheme,
  getSystemTheme,
  isTheme,
  THEME_MEDIA_QUERY,
} from '@/shared/lib/theme'
import type { Theme } from '@/shared/lib/theme'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(getInitialTheme)
  const preference = useRef(getStoredTheme())

  useLayoutEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia?.(THEME_MEDIA_QUERY)
    const handleSystemChange = (event: MediaQueryListEvent) => {
      if (preference.current === null) setTheme(event.matches ? 'dark' : 'light')
    }
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== LOCAL_STORAGE_KEYS.THEME && event.key !== null) return
      preference.current = isTheme(event.newValue) ? event.newValue : null
      setTheme(preference.current ?? getSystemTheme())
    }

    media?.addEventListener('change', handleSystemChange)
    window.addEventListener('storage', handleStorage)
    return () => {
      media?.removeEventListener('change', handleSystemChange)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    preference.current = nextTheme
    setTheme(nextTheme)
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, nextTheme)
    } catch {
      return
    }
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
