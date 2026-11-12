import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/model/authSlice'
import filterReducer from '@/features/catalog-filter/model/filterSlice'
import usersReducer from '@/entities/user/model/usersSlice'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { AppRouter } from './RouterProvider'

vi.mock('@/widgets/Header', () => ({ Header: () => <header>Шапка</header> }))
vi.mock('@/widgets/Footer', () => ({ Footer: () => <footer>Футер</footer> }))
vi.mock('@/pages/CatalogPage', () => ({ default: () => <main>Каталог</main> }))
vi.mock('@/pages/SkillPage', () => ({ default: () => <main>Навык</main> }))
vi.mock('@/pages/FavoritesPage', () => ({ default: () => <main>Избранное</main> }))
vi.mock('@/pages/ProfilePage', () => ({ default: () => <main>Профиль</main> }))
vi.mock('@/pages/CreateSkillPage', () => ({ default: () => <main>Создание</main> }))
vi.mock('@/pages/LoginPage', () => ({ default: () => <main>Вход</main> }))
vi.mock('@/pages/RegisterPage', () => ({ default: () => <main>Регистрация</main> }))
vi.mock('@/pages/NotFoundPage', () => ({ default: () => <main>404</main> }))

const AUTH_USER = { id: '0', name: 'Алексей', email: 'alexey@example.com', token: 'mock_token_0' }

const openPage = (path: string, isAuth = false) => {
  if (isAuth) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(AUTH_USER))
  }
  const store = configureStore({
    reducer: { auth: authReducer, filter: filterReducer, users: usersReducer },
  })
  window.history.pushState({}, '', path)
  render(
    <Provider store={store}>
      <AppRouter />
    </Provider>,
  )
}

describe('AppRouter и общая обёртка страниц', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/')
    localStorage.clear()
  })

  it.each([
    ['/', 'Каталог'],
    ['/unknown-page', '404'],
  ])('на странице %s показываются шапка и футер', async (path, content) => {
    openPage(path)

    expect(await screen.findByText(content)).toBeInTheDocument()
    expect(screen.getByText('Шапка')).toBeInTheDocument()
    expect(screen.getByText('Футер')).toBeInTheDocument()
  })

  it.each([
    ['/profile', 'Профиль'],
    ['/favorites', 'Избранное'],
    ['/create', 'Создание'],
    ['/skill/1', 'Навык'],
  ])(
    'авторизованному пользователю на странице %s показываются шапка и футер',
    async (path, content) => {
      openPage(path, true)

      expect(await screen.findByText(content)).toBeInTheDocument()
      expect(screen.getByText('Шапка')).toBeInTheDocument()
      expect(screen.getByText('Футер')).toBeInTheDocument()
    },
  )

  it.each(['/profile', '/favorites', '/create', '/skill/1'])(
    'гостя со страницы %s отправляет на вход',
    async (path) => {
      openPage(path)

      expect(await screen.findByText('Вход')).toBeInTheDocument()
      expect(screen.queryByText('Шапка')).not.toBeInTheDocument()
    },
  )

  it.each([
    ['/login', 'Вход'],
    ['/register', 'Регистрация'],
  ])('на странице %s шапки и футера нет', async (path, content) => {
    openPage(path)

    expect(await screen.findByText(content)).toBeInTheDocument()
    expect(screen.queryByText('Шапка')).not.toBeInTheDocument()
    expect(screen.queryByText('Футер')).not.toBeInTheDocument()
  })
})