import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import authReducer from '@/features/auth/model/authSlice'
import filterReducer, {
  initialState as initialFilterState,
} from '@/features/catalog-filter/model/filterSlice'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { AuthUser } from '@/shared/types'
import ProfilePage from './index'

vi.mock('@/shared/assets/icons/Envelope.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Message.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Like.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Idea.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/User.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Pencil.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/GalleryEdit.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Calendar.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Chevron.svg?react', () => ({ default: () => null }))

const user: AuthUser = {
  id: '1',
  name: 'Алексей',
  email: 'alexey@example.com',
  avatar: '/db/images/avatars/alexey.jpg',
  birthDate: '1988-03-14',
  gender: 'male',
  city: 'Москва',
  bio: 'Открыт к новым навыкам',
  token: 'mock_token_1',
}

function createStore() {
  return configureStore({
    reducer: { auth: authReducer, filter: filterReducer },
    preloadedState: {
      auth: { user, status: 'succeeded' as const, error: null },
      filter: {
        ...initialFilterState,
        cityOptions: [{ id: '14', name: 'Москва' }],
        status: 'succeeded' as const,
      },
    },
  })
}

describe('ProfilePage', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(user))
  })

  it('показывает данные текущего пользователя и сохраняет изменения', async () => {
    const store = createStore()
    render(
      <Provider store={store}>
        <ProfilePage />
      </Provider>,
    )

    expect(screen.getByDisplayValue('alexey@example.com')).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Очистить поле' })).not.toBeInTheDocument()
    expect(screen.getByDisplayValue('14.03.1988')).toBeInTheDocument()
    expect(screen.getByText('Мужской')).toBeInTheDocument()
    expect(screen.getByText('Москва')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Сохранить' })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Изменить имя' }))
    fireEvent.change(screen.getByDisplayValue('Алексей'), {
      target: { value: 'Алексей Петров' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }))

    await waitFor(() => {
      expect(store.getState().auth.user?.name).toBe('Алексей Петров')
    })
    expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER) ?? '{}').name).toBe(
      'Алексей Петров',
    )
  })
})
