import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatePickerComponent } from './DatePicker'

vi.mock('@/shared/assets/icons/Calendar.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Chevron.svg?react', () => ({ default: () => null }))

function renderInForm() {
  const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
  const onChange = vi.fn()
  const { container } = render(
    <form onSubmit={onSubmit}>
      <DatePickerComponent onChange={onChange} />
      <button type="submit">Продолжить</button>
    </form>,
  )
  return { onSubmit, onChange, container }
}

const openCalendar = () =>
  userEvent.click(screen.getByRole('button', { name: 'Выбрать дату рождения' }))

describe('DatePickerComponent', () => {
  it('клик по дню не отправляет форму', async () => {
    const { onSubmit, container } = renderInForm()
    await openCalendar()

    const day = container.querySelector<HTMLButtonElement>('.rdp-day_button')
    expect(day).not.toBeNull()
    await userEvent.click(day!)

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('выбранная дата попадает в поле по кнопке «Выбрать»', async () => {
    const { onChange, container } = renderInForm()
    await openCalendar()

    await userEvent.click(container.querySelector<HTMLButtonElement>('.rdp-day_button')!)
    await userEvent.click(screen.getByRole('button', { name: 'Выбрать' }))

    expect(onChange).toHaveBeenCalledWith(expect.stringMatching(/^\d{2}\.\d{2}\.\d{4}$/))
  })

  it('клик мимо календаря закрывает его и не нажимает кнопку под ним', async () => {
    const { onSubmit } = renderInForm()
    await openCalendar()

    await userEvent.click(screen.getByTestId('date-picker-overlay'))

    expect(screen.queryByTestId('date-picker-overlay')).not.toBeInTheDocument()
    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('Escape закрывает календарь', async () => {
    renderInForm()
    await openCalendar()

    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
  })
})
