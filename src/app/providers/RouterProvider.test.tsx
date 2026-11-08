import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppRouter } from './RouterProvider'

vi.mock('@/widgets/Header', () => ({ Header: () => <header>Шапка</header> }))
vi.mock('@/widgets/Footer', () => ({ Footer: () => <footer>Футер</footer> }))
vi.mock('@/pages/CatalogPage', () => ({ default: () => <main>Каталог</main> }))
vi.mock('@/pages/SkillPage', () => ({ default: () => <main>Навык</main> }))
vi.mock('@/pages/FavoritesPage', () => ({ default: () => <main>Избранное</main> }))
vi.mock('@/pages/ProfilePage', () => ({ default: () => <main>Профиль</main> }))
vi.mock('@/pages/CreateSkillPage', () => ({ default: () => <main>Создание</main> }))
vi.mock('@/pages/LoginPage', () => ({ default: () => <main>Вход</main> }))
vi.mock('@/pages/NotFoundPage', () => ({ default: () => <main>404</main> }))

const openPage = (path: string) => {
  window.history.pushState({}, '', path)
  render(<AppRouter />)
}

describe('AppRouter и общая обёртка страниц', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it.each([
    ['/', 'Каталог'],
    ['/favorites', 'Избранное'],
    ['/profile', 'Профиль'],
    ['/create', 'Создание'],
    ['/skill/1', 'Навык'],
    ['/unknown-page', '404'],
  ])('на странице %s показываются шапка и футер', async (path, content) => {
    openPage(path)

    expect(await screen.findByText(content)).toBeInTheDocument()
    expect(screen.getByText('Шапка')).toBeInTheDocument()
    expect(screen.getByText('Футер')).toBeInTheDocument()
  })

  it.each(['/login', '/register'])('на странице %s шапки и футера нет', async (path) => {
    openPage(path)

    expect(await screen.findByText('Вход')).toBeInTheDocument()
    expect(screen.queryByText('Шапка')).not.toBeInTheDocument()
    expect(screen.queryByText('Футер')).not.toBeInTheDocument()
  })
})
