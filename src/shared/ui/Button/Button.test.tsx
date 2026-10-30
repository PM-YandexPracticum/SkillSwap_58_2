import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('показывает переданный текст и по умолчанию имеет type="button"', () => {
    render(<Button>Войти</Button>)
    const button = screen.getByRole('button', { name: 'Войти' })
    expect(button).toHaveAttribute('type', 'button')
  })

  it('вызывает onClick при клике', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Войти</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Войти' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('не вызывает onClick, когда кнопка disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Войти
      </Button>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Войти' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('применяет класс варианта secondary и дополнительный className', () => {
    render(
      <Button variant="secondary" className="extra">
        Войти
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Войти' })
    expect(button.className).toMatch(/secondary/)
    expect(button).toHaveClass('extra')
  })
})
