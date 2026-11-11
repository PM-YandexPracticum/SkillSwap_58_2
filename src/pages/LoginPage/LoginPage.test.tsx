import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import LoginPage from './index'
import authReducer from '@/features/auth/model/authSlice'
import { fetchUserProfiles } from '@/api/users'

type Entry = string | { pathname: string; state?: unknown }

vi.mock('@/api/users', () => ({ fetchUserProfiles: vi.fn() }))

vi.mock('@/shared/ui/AuthButton', () => ({
  AuthButton: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
}))

vi.mock('@/shared/ui/Input/PasswordInput/PasswordInput', () => ({
  PasswordInput: ({
    value,
    onChange,
    errorMessage,
  }: {
    value: string
    onChange: (value: string) => void
    errorMessage?: string
  }) => (
    <label>
      Пароль
      <input
        type="password"
        placeholder="Введите пароль"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {errorMessage && <span>{errorMessage}</span>}
    </label>
  ),
}))

vi.mock('@/shared/ui/Logo/Logotype', () => ({
  Logotype: ({ onClick }: { onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      SkillSwap
    </button>
  ),
}))

vi.mock('@/shared/ui/CloseButton', () => ({
  CloseButton: ({ onClick }: { onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      Закрыть
    </button>
  ),
}))

const mockUsers = [
  { id: 0, name: 'Алексей', avatar: 'a.jpg', login: 'alexey@example.com', password: 'secret123' },
]

const renderLogin = (initialEntries: Entry[]) => {
  const store = configureStore({ reducer: { auth: authReducer } })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries} initialIndex={initialEntries.length - 1}>
        <Routes>
          <Route path="/" element={<div>Главная</div>} />
          <Route path="/skill/1" element={<div>Страница навыка</div>} />
          <Route path="/profile" element={<div>Профиль</div>} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
  return store
}

const fillForm = async (email: string, password: string) => {
  await userEvent.type(screen.getByPlaceholderText('Введите email'), email)
  await userEvent.type(screen.getByPlaceholderText('Введите пароль'), password)
  await userEvent.click(screen.getByRole('button', { name: 'Войти' }))
}

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(fetchUserProfiles).mockResolvedValue(mockUsers as never)
  })

  it('показывает форму входа и приветствие', () => {
    renderLogin(['/login'])
    expect(screen.getByText('Продолжить с Google')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
    expect(screen.getByText('Добро пожаловать в SkillSwap!')).toBeInTheDocument()
  })

  it('кнопка «Закрыть» возвращает на предыдущую страницу', async () => {
    renderLogin(['/skill/1', '/login'])
    await userEvent.click(screen.getByRole('button', { name: 'Закрыть' }))
    expect(screen.getByText('Страница навыка')).toBeInTheDocument()
  })

  it('если открыли /login напрямую, «Закрыть» ведёт на главную', async () => {
    renderLogin(['/login'])
    await userEvent.click(screen.getByRole('button', { name: 'Закрыть' }))
    expect(screen.getByText('Главная')).toBeInTheDocument()
  })

  it('показывает ошибки валидации для пустой формы', async () => {
    renderLogin(['/login'])
    await userEvent.click(screen.getByRole('button', { name: 'Войти' }))
    expect(await screen.findByText('Введите email')).toBeInTheDocument()
    expect(screen.getByText('Введите пароль')).toBeInTheDocument()
  })

  it('показывает ошибку при неверных данных', async () => {
    renderLogin(['/login'])
    await fillForm('alexey@example.com', 'wrong')
    expect(await screen.findByRole('alert')).toHaveTextContent('Email или пароль введён неверно')
  })

  it('после входа возвращает на страницу, откуда отправил PrivateRoute', async () => {
    const store = renderLogin([{ pathname: '/login', state: { from: { pathname: '/profile' } } }])
    await fillForm('alexey@example.com', 'secret123')
    expect(await screen.findByText('Профиль')).toBeInTheDocument()
    expect(store.getState().auth.user?.name).toBe('Алексей')
  })
})
