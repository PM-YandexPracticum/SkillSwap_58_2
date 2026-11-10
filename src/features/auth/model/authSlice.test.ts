import { beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, { LOGIN_ERROR, login, logout } from './authSlice'
import { fetchUserProfiles } from '../../../api/users'
import { LOCAL_STORAGE_KEYS } from '../../../shared/lib/constants'

vi.mock('../../../api/users', () => ({ fetchUserProfiles: vi.fn() }))

const mockUsers = [
  {
    id: 0,
    name: 'Алексей',
    avatar: 'images/avatars/a.jpg',
    login: 'alexey@example.com',
    password: 'secret123',
  },
]

const createStore = () => configureStore({ reducer: { auth: authReducer } })

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(fetchUserProfiles).mockResolvedValue(mockUsers as never)
  })

  it('входит с правильными данными и сохраняет пользователя в localStorage', async () => {
    const store = createStore()
    await store.dispatch(login({ email: 'alexey@example.com', password: 'secret123' }))

    const { user, status } = store.getState().auth
    expect(status).toBe('succeeded')
    expect(user).toMatchObject({ id: '0', name: 'Алексей', avatar: '/db/images/avatars/a.jpg' })
    expect(user?.token).toBeTruthy()
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)).not.toBeNull()
  })

  it('игнорирует регистр и пробелы в email', async () => {
    const store = createStore()
    await store.dispatch(login({ email: '  ALEXEY@example.com ', password: 'secret123' }))
    expect(store.getState().auth.user).not.toBeNull()
  })

  it('показывает ошибку при неверных данных', async () => {
    const store = createStore()
    await store.dispatch(login({ email: 'alexey@example.com', password: 'wrong' }))

    const { user, status, error } = store.getState().auth
    expect(user).toBeNull()
    expect(status).toBe('failed')
    expect(error).toBe(LOGIN_ERROR)
  })

  it('выход очищает пользователя и localStorage', async () => {
    const store = createStore()
    await store.dispatch(login({ email: 'alexey@example.com', password: 'secret123' }))
    await store.dispatch(logout())

    expect(store.getState().auth.user).toBeNull()
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)).toBeNull()
  })

  it('после перезагрузки берёт пользователя из localStorage', async () => {
    await createStore().dispatch(login({ email: 'alexey@example.com', password: 'secret123' }))
    const freshStore = createStore()
    expect(freshStore.getState().auth.user?.name).toBe('Алексей')
  })
})
