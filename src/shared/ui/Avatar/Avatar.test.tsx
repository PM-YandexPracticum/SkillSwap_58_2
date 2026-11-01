import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('показывает фото с переданным alt', () => {
    render(<Avatar src="/photo.jpg" alt="Иван" />)
    expect(screen.getByRole('img', { name: 'Иван' })).toHaveAttribute('src', '/photo.jpg')
  })

  it('без src показывает заглушку с первой буквой имени', () => {
    render(<Avatar alt="анна" />)
    expect(screen.getByRole('img', { name: 'анна' })).toHaveTextContent('А')
  })

  it('при ошибке загрузки фото переключается на заглушку', () => {
    render(<Avatar src="/broken.jpg" alt="Максим" />)
    fireEvent.error(screen.getByRole('img', { name: 'Максим' }))
    expect(screen.getByRole('img', { name: 'Максим' })).toHaveTextContent('М')
  })

  it('применяет размер через CSS-переменную', () => {
    const { container } = render(<Avatar alt="Иван" size={48} />)
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--avatar-size')).toBe(
      '48px',
    )
  })
})
