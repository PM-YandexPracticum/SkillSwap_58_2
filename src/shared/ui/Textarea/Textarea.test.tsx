import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('связывает label с полем', () => {
    render(<Textarea label="Описание" />)
    expect(screen.getByLabelText('Описание')).toBeInTheDocument()
  })

  it('показывает плейсхолдер', () => {
    render(<Textarea placeholder="Коротко опишите" />)
    expect(screen.getByPlaceholderText('Коротко опишите')).toBeInTheDocument()
  })

  it('показывает подсказку', () => {
    render(<Textarea label="Описание" hint="Не более 500 символов" />)
    expect(screen.getByText('Не более 500 символов')).toBeInTheDocument()
  })

  it('при ошибке показывает её вместо подсказки и помечает поле', () => {
    render(<Textarea label="Описание" hint="Подсказка" error="Ошибка" />)
    expect(screen.getByText('Ошибка')).toBeInTheDocument()
    expect(screen.queryByText('Подсказка')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Описание')).toHaveAttribute('aria-invalid', 'true')
  })

  it('позволяет вводить текст', async () => {
    render(<Textarea label="Описание" />)
    const field = screen.getByLabelText('Описание')
    await userEvent.type(field, 'Учу гитаре')
    expect(field).toHaveValue('Учу гитаре')
  })
})
