import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import registrationReducer from '../model/registrationSlice'
import { EMPTY_DRAFT, type CompletedStep } from '../model/registrationStorage'
import { ROUTES } from '@/shared/lib/constants'
import { RegistrationGuard } from './RegistrationGuard'

function renderAt(path: string, completedStep: CompletedStep) {
  const store = configureStore({
    reducer: { registration: registrationReducer },
    preloadedState: {
      registration: { draft: EMPTY_DRAFT, completedStep, status: 'idle' as const, error: null },
    },
  })

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={ROUTES.REGISTER_STEP_1} element={<p>Шаг 1</p>} />
          <Route element={<RegistrationGuard requiredStep={1} />}>
            <Route path={ROUTES.REGISTER_STEP_2} element={<p>Шаг 2</p>} />
          </Route>
          <Route element={<RegistrationGuard requiredStep={2} />}>
            <Route path={ROUTES.REGISTER_STEP_3} element={<p>Шаг 3</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
}

describe('RegistrationGuard', () => {
  beforeEach(() => sessionStorage.clear())

  it('без шага 1 отправляет со второго шага на первый', () => {
    renderAt(ROUTES.REGISTER_STEP_2, 0)
    expect(screen.getByText('Шаг 1')).toBeInTheDocument()
  })

  it('после шага 1 пускает на второй шаг', () => {
    renderAt(ROUTES.REGISTER_STEP_2, 1)
    expect(screen.getByText('Шаг 2')).toBeInTheDocument()
  })

  it('без шага 2 отправляет с третьего шага на второй', () => {
    renderAt(ROUTES.REGISTER_STEP_3, 1)
    expect(screen.getByText('Шаг 2')).toBeInTheDocument()
  })

  it('без шага 1 с третьего шага отправляет на первый', () => {
    renderAt(ROUTES.REGISTER_STEP_3, 0)
    expect(screen.getByText('Шаг 1')).toBeInTheDocument()
  })

  it('после шага 2 пускает на третий шаг', () => {
    renderAt(ROUTES.REGISTER_STEP_3, 2)
    expect(screen.getByText('Шаг 3')).toBeInTheDocument()
  })
})
