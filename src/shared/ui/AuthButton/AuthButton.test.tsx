import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthButton } from './AuthButton'

vi.mock('@/shared/assets/icons/Google.svg?react', () => ({
  default: () => <svg data-testid="google-icon" />,
}))
vi.mock('@/shared/assets/icons/Apple.svg?react', () => ({
  default: () => <svg data-testid="apple-icon" />,
}))

describe('AuthButton', () => {
  it('показывает текст и по умолчанию имеет type="button"', () => {
    render(<AuthButton provider="google">Продолжить с Google</AuthButton>)
    const button = screen.getByRole('button', { name: 'Продолжить с Google' })
    expect(button).toHaveAttribute('type', 'button')
  })

  it('показывает иконку выбранного провайдера', () => {
    const { rerender } = render(<AuthButton provider="google">Продолжить с Google</AuthButton>)
    expect(screen.getByTestId('google-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('apple-icon')).not.toBeInTheDocument()

    rerender(<AuthButton provider="apple">Продолжить с Apple</AuthButton>)
    expect(screen.getByTestId('apple-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('google-icon')).not.toBeInTheDocument()
  })

  it('вызывает onClick при клике, если он передан', async () => {
    const onClick = vi.fn()
    render(
      <AuthButton provider="apple" onClick={onClick}>
        Продолжить с Apple
      </AuthButton>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Продолжить с Apple' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('не падает при клике без обработчика', async () => {
    render(<AuthButton provider="google">Продолжить с Google</AuthButton>)
    await userEvent.click(screen.getByRole('button', { name: 'Продолжить с Google' }))
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('не вызывает onClick, когда кнопка disabled', async () => {
    const onClick = vi.fn()
    render(
      <AuthButton provider="google" onClick={onClick} disabled>
        Продолжить с Google
      </AuthButton>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Продолжить с Google' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
