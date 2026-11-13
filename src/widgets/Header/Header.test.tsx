import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Header } from './Header'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import skillCategoriesReducer from '@/entities/skills/model/skillCategoriesSlice'

// В конфиге Vitest нет плагина svgr, поэтому SVG-иконки (?react) заменяем заглушками
vi.mock('@/shared/assets/icons/Notification.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Like.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Logout.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/ChevronDown.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Moon.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Logo.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Search.svg?react', () => ({ default: () => null }))

const createTestStore = () =>
  configureStore({
    reducer: {
      skillCategories: skillCategoriesReducer,
    },
  })

const renderWithStore = (ui: React.ReactElement) => {
  const store = createTestStore()
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('Header', () => {
  it('показывает логотип, меню, кнопки и переключатель темы', () => {
    renderWithStore(<Header />)
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
    renderWithStore(<Header onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />)

    await userEvent.click(screen.getByRole('button', { name: 'Войти' }))
    await userEvent.click(screen.getByRole('button', { name: 'Зарегистрироваться' }))

    expect(onLoginClick).toHaveBeenCalledTimes(1)
    expect(onRegisterClick).toHaveBeenCalledTimes(1)
  })

  it('отправляет поисковый запрос без лишних пробелов', async () => {
    const onSearch = vi.fn()
    renderWithStore(<Header onSearch={onSearch} />)

    await userEvent.type(screen.getByPlaceholderText('Искать навык'), '  Английский  {enter}')

    expect(onSearch).toHaveBeenCalledWith('Английский')
  })

  it('передаёт изменения поиска и использует переданное значение', async () => {
    const onSearchChange = vi.fn()
    const ControlledHeader = () => {
      const [searchValue, setSearchValue] = useState('Английский')
      return (
        <Header
          searchValue={searchValue}
          onSearchChange={(value) => {
            onSearchChange(value)
            setSearchValue(value)
          }}
        />
      )
    }

    renderWithStore(<ControlledHeader />)

    const input = screen.getByPlaceholderText('Искать навык')
    expect(input).toHaveValue('Английский')

    await userEvent.clear(input)
    await userEvent.type(input, 'Рисование')

    expect(onSearchChange).toHaveBeenLastCalledWith('Рисование')
  })

  it('для авторизованного пользователя показывает имя вместо кнопок входа', () => {
    renderWithStore(<Header user={{ name: 'Мария' }} />)
    expect(screen.getByText('Мария')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Уведомления' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Избранное' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Войти' })).not.toBeInTheDocument()
  })

  it('по клику на пользователя открывает меню с личным кабинетом и выходом', async () => {
    const onProfileClick = vi.fn()
    const onLogoutClick = vi.fn()
    renderWithStore(
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