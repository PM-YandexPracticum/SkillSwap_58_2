import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { loadFilterOptions } from '@/features/catalog-filter/model/filterSlice'
import filterReducer from '@/features/catalog-filter/model/filterSlice'
import { loadUsers } from '@/entities/user/model/usersSlice'
import usersReducer from '@/entities/user/model/usersSlice'
import authReducer from '@/features/auth/model/authSlice'
import { MemoryRouter } from 'react-router-dom'
import type { UserProfile } from '@/shared/types'
import CatalogPage from './index'

vi.mock('@/shared/assets/icons/CheckboxEmpty.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/CheckboxDone.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/CheckboxRemove.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Chevron.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Cross.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Like.svg?react', () => ({ default: () => null }))

const categories = [
  { id: 0, category: 'Языки', icon: '', subcategories: ['Английский'], color: '#fff' },
]
const cities = [
  { id: '1', name: 'Москва' },
  { id: '2', name: 'Казань' },
]

const users: UserProfile[] = [
  {
    id: 1,
    name: 'Алексей',
    avatar: '',
    birth_date: '1990-01-01',
    gender: 'Мужской',
    city: 'Москва',
    likes: 10,
    date_created: '2025-01-01',
    bio: '',
    can_teach: {
      name: 'Английский',
      category: 'Языки',
      subcategory: 'Английский',
      description: '',
      images: [],
    },
    want_to_learn: [],
  },
  {
    id: 2,
    name: 'Мария',
    avatar: '',
    birth_date: '1995-01-01',
    gender: 'Женский',
    city: 'Казань',
    likes: 20,
    date_created: '2025-02-01',
    bio: '',
    can_teach: {
      name: 'Рисование',
      category: 'Творчество',
      subcategory: 'Рисование',
      description: '',
      images: [],
    },
    want_to_learn: [],
  },
]

function renderCatalog() {
  const filter = filterReducer(
    undefined,
    loadFilterOptions.fulfilled({ categories, cities }, 'options-request'),
  )
  const usersState = usersReducer(
    undefined,
    loadUsers.fulfilled({ items: users, recommendedOrder: [1, 2] }, 'users-request', undefined),
  )
  const store = configureStore({
    reducer: { filter: filterReducer, users: usersReducer, auth: authReducer },
    preloadedState: { filter, users: usersState },
  })

  render(
    <Provider store={store}>
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    </Provider>,
  )
}

describe('CatalogPage filtering', () => {
  it('switches to filtered results and removes a chip from the sidebar state', async () => {
    const user = userEvent.setup()
    renderCatalog()

    expect(screen.getByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
    await user.click(screen.getByLabelText('Казань'))

    expect(screen.getByRole('heading', { name: 'Подходящие предложения: 1' })).toBeInTheDocument()
    expect(screen.getByLabelText('Удалить фильтр Казань')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Удалить фильтр Казань'))

    expect(screen.getByLabelText('Казань')).not.toBeChecked()
    expect(screen.getByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
    expect(screen.queryByText(/Подходящие предложения:/)).not.toBeInTheDocument()
  })
})
