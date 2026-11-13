import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import authReducer from '@/features/auth/model/authSlice'
import filterReducer from '@/features/catalog-filter/model/filterSlice'
import usersReducer from '@/entities/user/model/usersSlice'
import { ROUTES } from '@/shared/lib/constants'
import type { UserProfile } from '@/shared/types'
import FavoritesPage from './index'

// svgr в Vitest не настроен — заменяем виджеты с иконками простыми заглушками
vi.mock('@/widgets/Sidebar', () => ({
  Sidebar: () => <aside>Фильтры</aside>,
}))

vi.mock('@/widgets/SkillCard', () => ({
  SkillCard: ({ user }: { user: { name: string; isLiked?: boolean } }) => (
    <article>
      {user.name}
      {user.isLiked && ' (в избранном)'}
    </article>
  ),
}))

const makeUser = (id: number, name: string): UserProfile => ({
  id,
  name,
  avatar: 'images/avatars/test.jpg',
  birth_date: '1990-01-01',
  gender: 'Мужской',
  city: 'Москва',
  likes: id,
  date_created: '2024-01-01',
  bio: '',
  can_teach: {
    name: 'Тайм-менеджмент',
    category: 'Бизнес и карьера',
    subcategory: 'Тайм-менеджмент',
    description: '',
    images: [],
  },
  want_to_learn: [],
})

const users = Array.from({ length: 14 }, (_, index) => makeUser(index, `Пользователь ${index}`))

function renderPage(favorites?: number[]) {
  const store = configureStore({
    reducer: { auth: authReducer, filter: filterReducer, users: usersReducer },
    preloadedState: {
      auth: {
        user: { id: '0', name: 'Алексей', email: 'a@example.com', token: 't', favorites },
        status: 'idle' as const,
        error: null,
      },
      filter: { ...filterReducer(undefined, { type: 'init' }), status: 'succeeded' as const },
      users: {
        ...usersReducer(undefined, { type: 'init' }),
        items: users,
        status: 'succeeded' as const,
      },
    },
  })

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[ROUTES.FAVORITES]}>
        <Routes>
          <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />
          <Route path={ROUTES.HOME} element={<p>Каталог</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
}

describe('FavoritesPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() })),
    )
  })

  it('показывает только избранных пользователей с зелёным сердечком', () => {
    renderPage([2, 5])

    expect(screen.getByRole('heading', { name: 'Избранное' })).toBeInTheDocument()
    expect(screen.getByText('Пользователь 2 (в избранном)')).toBeInTheDocument()
    expect(screen.getByText('Пользователь 5 (в избранном)')).toBeInTheDocument()
    expect(screen.queryByText(/Пользователь 3/)).not.toBeInTheDocument()
  })

  it('сначала показывает не больше 9 карточек', () => {
    renderPage([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])

    expect(screen.getAllByRole('article')).toHaveLength(9)
  })

  it('при пустом избранном показывает кнопку и ведёт в каталог', async () => {
    renderPage([])

    expect(screen.getByText('Вы пока никого не добавили в избранное')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Вернуться в каталог' }))
    expect(screen.getByText('Каталог')).toBeInTheDocument()
  })

  it('считает избранное пустым, если поля favorites нет', () => {
    renderPage(undefined)

    expect(screen.getByRole('button', { name: 'Вернуться в каталог' })).toBeInTheDocument()
  })
})
