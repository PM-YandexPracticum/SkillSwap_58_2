import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SkillCard } from './SkillCard'

vi.mock('../../shared/ui/Like/Like', () => ({
  LikeComponent: () => null,
}))

const props = {
  user: { name: 'Илона', city: 'Екатеринбург', birth_date: '1993-05-02' },
  canTeach: { label: 'Английский язык' },
  wantToLearn: [
    { label: 'Тайм менеджмент' },
    { label: 'Медитация' },
    { label: 'Игра на барабанах' },
    { label: 'Бизнес-план' },
  ],
}

describe('SkillCard', () => {
  it('показывает имя и навык, которому может научить', () => {
    render(<SkillCard {...props} />)
    expect(screen.getByText('Илона')).toBeInTheDocument()
    expect(screen.getByText('Английский язык')).toBeInTheDocument()
  })

  it('показывает не больше 2 тегов «Хочет научиться» и счётчик остальных', () => {
    render(<SkillCard {...props} />)
    expect(screen.getByText('Тайм менеджмент')).toBeInTheDocument()
    expect(screen.getByText('Медитация')).toBeInTheDocument()
    expect(screen.queryByText('Игра на барабанах')).not.toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('не показывает счётчик, если тегов мало', () => {
    render(<SkillCard {...props} wantToLearn={[{ label: 'Медитация' }]} />)
    expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument()
  })

  it('вызывает onDetailsClick по кнопке «Подробнее»', async () => {
    const onDetailsClick = vi.fn()
    render(<SkillCard {...props} onDetailsClick={onDetailsClick} />)
    await userEvent.click(screen.getByRole('button', { name: 'Подробнее' }))
    expect(onDetailsClick).toHaveBeenCalledTimes(1)
  })
})
