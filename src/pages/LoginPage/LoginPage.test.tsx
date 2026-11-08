import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './index'

vi.mock('@/shared/ui/AuthButton', () => ({
  AuthButton: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
}))

vi.mock('@/shared/ui/Input/PasswordInput/PasswordInput', () => ({
  PasswordInput: ({ label = 'Пароль' }: { label?: string }) => (
    <label>
      {label}
      <input type="password" />
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

const renderLogin = (initialEntries: string[]) =>
  render(
    <MemoryRouter initialEntries={initialEntries} initialIndex={initialEntries.length - 1}>
      <Routes>
        <Route path="/" element={<div>Главная</div>} />
        <Route path="/skill/1" element={<div>Страница навыка</div>} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </MemoryRouter>,
  )

describe('LoginPage', () => {
  it('показывает форму входа и приветствие', () => {
    renderLogin(['/login'])
    expect(screen.getByText('Продолжить с Google')).toBeInTheDocument()
    expect(screen.getByText('Продолжить с Apple')).toBeInTheDocument()
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
})
