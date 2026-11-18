import { lazy } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MainLayout } from './MainLayout'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import filterReducer from '@/features/catalog-filter/model/filterSlice'
import usersReducer from '@/entities/user/model/usersSlice'
import authReducer from '@/features/auth/model/authSlice'

vi.mock('@/widgets/Header', () => ({ Header: () => <header>Шапка</header> }))
vi.mock('@/widgets/Footer', () => ({ Footer: () => <footer>Футер</footer> }))

describe('MainLayout', () => {
  it('показывает шапку, содержимое страницы и футер в таком порядке', () => {
    const store = configureStore({
      reducer: { filter: filterReducer, users: usersReducer, auth: authReducer },
    })

    render(
      <ThemeProvider>
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<main>Содержимое</main>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </Provider>
      </ThemeProvider>,
    )

    const header = screen.getByText('Шапка')
    const content = screen.getByText('Содержимое')
    const footer = screen.getByText('Футер')

    expect(header.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(content.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('пока страница загружается, показывает лоадер между шапкой и футером', () => {
    const store = configureStore({
      reducer: { filter: filterReducer, users: usersReducer, auth: authReducer },
    })
    const PendingPage = lazy(() => new Promise<never>(() => {}))

    render(
      <ThemeProvider>
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<PendingPage />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </Provider>
      </ThemeProvider>,
    )

    const header = screen.getByText('Шапка')
    const loader = screen.getByRole('status', { name: 'Загрузка' })
    const footer = screen.getByText('Футер')

    expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument()
    expect(header.compareDocumentPosition(loader) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(loader.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
