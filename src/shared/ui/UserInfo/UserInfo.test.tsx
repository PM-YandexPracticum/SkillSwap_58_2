import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserInfo } from './UserInfo'

vi.mock('../Like/Like', () => ({
  LikeComponent: () => <span data-testid="like" />,
}))

describe('UserInfo', () => {
  it('по умолчанию показывает лайки', () => {
    render(<UserInfo name="Иван" city="Москва" birth_date="1990-01-01" likes={5} />)
    expect(screen.getByText('Иван')).toBeInTheDocument()
    expect(screen.getByTestId('like')).toBeInTheDocument()
  })

  it('скрывает лайки при showLikes={false}', () => {
    render(<UserInfo name="Иван" city="Москва" birth_date="1990-01-01" showLikes={false} />)
    expect(screen.getByText('Иван')).toBeInTheDocument()
    expect(screen.queryByTestId('like')).not.toBeInTheDocument()
  })
})
