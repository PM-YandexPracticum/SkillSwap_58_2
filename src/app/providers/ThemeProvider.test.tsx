import { StrictMode } from 'react'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider, useTheme } from './ThemeProvider'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { THEME_MEDIA_QUERY } from '@/shared/lib/theme'

let systemTheme: EventTarget & { matches: boolean }

function Controls() {
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>{theme}</button>
}

function renderTheme() {
  return render(
    <StrictMode>
      <ThemeProvider>
        <Controls />
      </ThemeProvider>
    </StrictMode>,
  )
}

function changeSystemTheme(matches: boolean) {
  systemTheme.matches = matches
  act(() => {
    systemTheme.dispatchEvent(Object.assign(new Event('change'), { matches }))
  })
}

beforeEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
  systemTheme = Object.assign(new EventTarget(), { matches: false })
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => systemTheme),
  )
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  delete document.documentElement.dataset.theme
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('ThemeProvider', () => {
  it('использует системную тему без сохранённого выбора', () => {
    systemTheme.matches = true
    renderTheme()

    expect(window.matchMedia).toHaveBeenCalledWith(THEME_MEDIA_QUERY)
    expect(screen.getByRole('button')).toHaveTextContent('dark')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.THEME)).toBeNull()
  })

  it('сохранённая светлая тема имеет приоритет над тёмной системной', () => {
    systemTheme.matches = true
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, 'light')
    renderTheme()

    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  it('игнорирует некорректное сохранённое значение', () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, 'invalid')
    systemTheme.matches = true
    renderTheme()

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })

  it('переключает обе темы, сохраняет выбор и восстанавливает после повторного открытия', async () => {
    const view = renderTheme()
    await userEvent.click(screen.getByRole('button'))
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.THEME)).toBe('dark')

    view.unmount()
    renderTheme()
    expect(screen.getByRole('button')).toHaveTextContent('dark')
    await userEvent.click(screen.getByRole('button'))
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.THEME)).toBe('light')
  })

  it('следует изменению системы до ручного выбора', async () => {
    renderTheme()
    changeSystemTheme(true)
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    await userEvent.click(screen.getByRole('button'))
    changeSystemTheme(false)
    changeSystemTheme(true)
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  it('синхронизирует выбор между вкладками и возвращается к системе при удалении настройки', () => {
    renderTheme()
    act(() =>
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: LOCAL_STORAGE_KEYS.THEME,
          newValue: 'dark',
        }),
      ),
    )
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    act(() =>
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: LOCAL_STORAGE_KEYS.THEME,
          newValue: null,
        }),
      ),
    )
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  it('продолжает переключать тему при недоступном localStorage', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage unavailable', 'SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage unavailable', 'SecurityError')
    })
    renderTheme()
    await userEvent.click(screen.getByRole('button'))
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    changeSystemTheme(false)
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })

  it('выбирает светлую тему, если matchMedia недоступен', () => {
    vi.stubGlobal('matchMedia', undefined)
    renderTheme()
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })
})
