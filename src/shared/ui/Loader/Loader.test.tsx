import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Loader } from './Loader'

describe('Loader', () => {
  it('сообщает скринридерам о загрузке', () => {
    render(<Loader />)
    expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument()
  })

  it('принимает свою подпись', () => {
    render(<Loader label="Загружаем навык" />)
    expect(screen.getByRole('status', { name: 'Загружаем навык' })).toBeInTheDocument()
  })

  it('по умолчанию имеет диаметр 80px', () => {
    render(<Loader />)
    expect(screen.getByRole('status')).toHaveStyle({ '--loader-size': '80px' })
  })

  it('меняет диаметр через size', () => {
    render(<Loader size={40} />)
    expect(screen.getByRole('status')).toHaveStyle({ '--loader-size': '40px' })
  })

  it('добавляет переданный className', () => {
    render(<Loader className="custom" />)
    expect(screen.getByRole('status')).toHaveClass('custom')
  })
})
