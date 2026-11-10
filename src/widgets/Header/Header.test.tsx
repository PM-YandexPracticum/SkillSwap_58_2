import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'

// В конфиге Vitest нет плагина svgr, поэтому SVG-иконки (?react) заменяем заглушками
vi.mock('@/shared/assets/icons/Notification.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Like.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Logout.svg?react', () => ({ default: () => null }))
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
  it('для авторизованного пользователя показывает имя вместо кнопок входа', () => {
    render(<Header user={{ name: 'Мария' }} />)
    expect(screen.getByText('Мария')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Уведомления' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Избранное' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Войти' })).not.toBeInTheDocument()
  })

  it('по клику на пользователя открывает меню с личным кабинетом и выходом', async () => {
    const onProfileClick = vi.fn()
    const onLogoutClick = vi.fn()
    render(
      <Header
        user={{ name: 'Мария' }}
        onProfileClick={onProfileClick}
        onLogoutClick={onLogoutClick}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: /Мария/ }))
    await userEvent.click(screen.getByRole('menuitem', { name: 'Личный кабинет' }))
    expect(onProfileClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Мария/ }))
    await userEvent.click(screen.getByRole('menuitem', { name: /Выйти из аккаунта/ }))
    expect(onLogoutClick).toHaveBeenCalledTimes(1)
  })
})
