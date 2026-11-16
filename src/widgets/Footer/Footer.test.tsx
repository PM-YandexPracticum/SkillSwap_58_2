import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Footer } from './Footer'

vi.mock('@/shared/assets/icons/Logo.svg?react', () => ({ default: () => null }))

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('Footer', () => {
  it('оставляет все шесть пунктов текстом, пока адреса не заданы', () => {
    renderWithRouter(<Footer />)

    expect(screen.getAllByRole('listitem')).toHaveLength(6)
    expect(screen.queryAllByRole('link')).toHaveLength(1)
    expect(screen.getByText(`SkillSwap — ${new Date().getFullYear()}`)).toBeInTheDocument()
  })

  it('превращает только пункты с адресами в ссылки', () => {
    renderWithRouter(<Footer links={{ about: '/about', contacts: 'mailto:hello@example.com' }} />)

    expect(screen.getAllByRole('link')).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'О проекте' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'Контакты' })).toHaveAttribute(
      'href',
      'mailto:hello@example.com',
    )
    expect(screen.getByText('Все навыки').tagName).toBe('SPAN')
  })
})