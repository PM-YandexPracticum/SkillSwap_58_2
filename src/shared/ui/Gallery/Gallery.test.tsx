import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Gallery } from './Gallery'

vi.mock('swiper/react', () => ({
  Swiper: ({
    children,
    className,
    direction,
  }: {
    children: ReactNode
    className?: string
    direction?: string
  }) => (
    <div className={className} data-direction={direction ?? 'horizontal'}>
      {children}
    </div>
  ),
  SwiperSlide: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))
vi.mock('swiper/modules', () => ({ Navigation: {}, Thumbs: {} }))
vi.mock('swiper/css', () => ({}))
vi.mock('swiper/css/navigation', () => ({}))
vi.mock('swiper/css/thumbs', () => ({}))

const makeImages = (count: number) =>
  Array.from({ length: count }, (_, index) => ({ src: `/photo-${index + 1}.png` }))

describe('Gallery', () => {
  it('ничего не рисует без изображений', () => {
    const { container } = render(<Gallery images={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('рисует главное фото и вертикальный сайдбар миниатюр', () => {
    const { container } = render(<Gallery images={makeImages(3)} />)
    expect(screen.getAllByAltText(/^Фото \d$/)).toHaveLength(3)
    expect(screen.getAllByAltText(/^Миниатюра \d$/)).toHaveLength(3)
    expect(container.querySelector('[data-direction="vertical"]')).toBeInTheDocument()
  })

  it('использует alt из данных, если он передан', () => {
    render(<Gallery images={[{ src: '/a.png', alt: 'Акварель' }, { src: '/b.png' }]} />)
    expect(screen.getByAltText('Акварель')).toBeInTheDocument()
  })

  it('не показывает «+N», если фото не больше трёх', () => {
    render(<Gallery images={makeImages(3)} />)
    expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument()
  })

  it('показывает «+N» с количеством остальных фото, если их больше трёх', () => {
    render(<Gallery images={makeImages(6)} />)
    expect(screen.getByText('+3')).toBeInTheDocument()
    expect(screen.getAllByText(/^\+\d+$/)).toHaveLength(1)
  })

  it('рисует кнопки навигации главного слайдера', () => {
    render(<Gallery images={makeImages(3)} />)
    expect(screen.getByRole('button', { name: 'Предыдущее фото' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Следующее фото' })).toBeInTheDocument()
  })

  it('для одного фото не рисует миниатюры', () => {
    render(<Gallery images={makeImages(1)} />)
    expect(screen.queryByAltText(/^Миниатюра/)).not.toBeInTheDocument()
  })

  it('добавляет переданный className', () => {
    const { container } = render(<Gallery images={makeImages(2)} className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })
})
