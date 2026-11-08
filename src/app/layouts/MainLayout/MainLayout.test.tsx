import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from './MainLayout'

vi.mock('@/widgets/Header', () => ({ Header: () => <header>Шапка</header> }))
vi.mock('@/widgets/Footer', () => ({ Footer: () => <footer>Футер</footer> }))

describe('MainLayout', () => {
  it('показывает шапку, содержимое страницы и футер в таком порядке', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<main>Содержимое</main>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    const header = screen.getByText('Шапка')
    const content = screen.getByText('Содержимое')
    const footer = screen.getByText('Футер')

    expect(header.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(content.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
