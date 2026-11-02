import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'

// В конфиге Vitest нет плагина svgr, поэтому SVG-иконки (?react) заменяем заглушками
vi.mock('@/shared/assets/icons/ChevronDown.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Moon.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Logo.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Search.svg?react', () => ({ default: () => null }))

describe('Header', () => {
  it('показывает логотип, меню, кнопки и переключатель темы', () => {
    render(<Header />)
    expect(screen.getByText('SkillSwap')).toBeInTheDocument()
    expect(screen.getByText('О проекте')).toBeInTheDocument()
    expect(screen.getByText('Все навыки')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Искать навык')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Переключить тему' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Зарегистрироваться' })).toBeInTheDocument()
  })

  it('вызывает onLoginClick и onRegisterClick', async () => {
    const onLoginClick = vi.fn()
    const onRegisterClick = vi.fn()
    render(<Header onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />)

    await userEvent.click(screen.getByRole('button', { name: 'Войти' }))
    await userEvent.click(screen.getByRole('button', { name: 'Зарегистрироваться' }))

    expect(onLoginClick).toHaveBeenCalledTimes(1)
    expect(onRegisterClick).toHaveBeenCalledTimes(1)
  })

  it('отправляет поисковый запрос без лишних пробелов', async () => {
    const onSearch = vi.fn()
    render(<Header onSearch={onSearch} />)

    await userEvent.type(screen.getByPlaceholderText('Искать навык'), '  Английский  {enter}')

    expect(onSearch).toHaveBeenCalledWith('Английский')
  })
})
