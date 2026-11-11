import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/model/authSlice'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { PrivateRoute } from './PrivateRoute'

const LoginStub = () => {
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname
  return <div>Вход, вернуться на {from}</div>
}

const renderAt = (path: string) => {
  const store = configureStore({ reducer: { auth: authReducer } })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/login" element={<LoginStub />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<div>Профиль</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
}

describe('PrivateRoute', () => {
  beforeEach(() => localStorage.clear())

  it('отправляет гостя на вход и запоминает, куда он шёл', () => {
    renderAt('/profile')
    expect(screen.getByText('Вход, вернуться на /profile')).toBeInTheDocument()
  })

  it('пускает авторизованного пользователя', () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.AUTH_USER,
      JSON.stringify({ id: '0', name: 'Алексей', email: 'a@a.ru', token: 't' }),
    )
    renderAt('/profile')
    expect(screen.getByText('Профиль')).toBeInTheDocument()
  })
})
