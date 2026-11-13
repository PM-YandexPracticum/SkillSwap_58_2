import { describe, it, expect, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, { toggleFavorite, type AuthState } from './authSlice'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { AuthUser } from '@/shared/types'

const alexey: AuthUser = {
  id: '0',
  name: 'Алексей',
  email: 'alexey@example.com',
  token: 'mock_token_0',
  favorites: [1],
}

function makeStore(user: AuthUser | null) {
  const auth: AuthState = { user, status: 'idle', error: null }
  return configureStore({ reducer: { auth: authReducer }, preloadedState: { auth } })
}

const savedFavorites = () =>
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER) ?? '{}').favorites

describe('toggleFavorite', () => {
  beforeEach(() => localStorage.clear())

  it('добавляет пользователя в избранное и сохраняет в localStorage', async () => {
    const store = makeStore(alexey)

    await store.dispatch(toggleFavorite(5))

    expect(store.getState().auth.user?.favorites).toEqual([1, 5])
    expect(savedFavorites()).toEqual([1, 5])
  })

  it('при повторном клике убирает из избранного', async () => {
    const store = makeStore(alexey)

    await store.dispatch(toggleFavorite(1))

    expect(store.getState().auth.user?.favorites).toEqual([])
    expect(savedFavorites()).toEqual([])
  })

  it('работает, если поля favorites ещё нет', async () => {
    const store = makeStore({ ...alexey, favorites: undefined })

    await store.dispatch(toggleFavorite(3))

    expect(store.getState().auth.user?.favorites).toEqual([3])
  })

  it('для гостя ничего не сохраняет', async () => {
    const store = makeStore(null)

    const result = await store.dispatch(toggleFavorite(5))

    expect(toggleFavorite.rejected.match(result)).toBe(true)
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)).toBeNull()
  })
})
