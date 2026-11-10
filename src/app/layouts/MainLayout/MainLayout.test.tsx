import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MainLayout } from './MainLayout'
import filterReducer from '@/features/catalog-filter/model/filterSlice'
import usersReducer from '@/entities/user/model/usersSlice'

vi.mock('@/widgets/Header', () => ({ Header: () => <header>Шапка</header> }))
vi.mock('@/widgets/Footer', () => ({ Footer: () => <footer>Футер</footer> }))

describe('MainLayout', () => {
  it('показывает шапку, содержимое страницы и футер в таком порядке', () => {
    const store = configureStore({
      reducer: { filter: filterReducer, users: usersReducer },
    })

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<main>Содержимое</main>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    const header = screen.getByText('Шапка')
    const content = screen.getByText('Содержимое')
    const footer = screen.getByText('Футер')

    expect(header.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(content.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
