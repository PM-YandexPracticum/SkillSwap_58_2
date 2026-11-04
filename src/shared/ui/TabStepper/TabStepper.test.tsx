import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TabStepper } from './TabStepper'

const getBars = () => screen.getAllByTestId('tab-stepper-bar')
const countActive = () => getBars().filter((bar) => bar.className.includes('barActive')).length

describe('TabStepper', () => {
  it('показывает текст «Шаг N из M» и столько линий, сколько шагов', () => {
    render(<TabStepper total={3} current={2} />)
    expect(screen.getByText('Шаг 2 из 3')).toBeInTheDocument()
    expect(getBars()).toHaveLength(3)
  })

  it('закрашивает пройденные и текущий шаги', () => {
    render(<TabStepper total={3} current={2} />)
    expect(countActive()).toBe(2)
    expect(getBars()[2].className).not.toContain('barActive')
  })

  it('на последнем шаге закрашены все линии', () => {
    render(<TabStepper total={3} current={3} />)
    expect(countActive()).toBe(3)
  })

  it('ограничивает текущий шаг допустимыми значениями', () => {
    const { rerender } = render(<TabStepper total={3} current={7} />)
    expect(screen.getByText('Шаг 3 из 3')).toBeInTheDocument()

    rerender(<TabStepper total={3} current={0} />)
    expect(screen.getByText('Шаг 1 из 3')).toBeInTheDocument()
  })

  it('не падает при некорректном количестве шагов', () => {
    render(<TabStepper total={0} current={5} />)
    expect(screen.getByText('Шаг 1 из 1')).toBeInTheDocument()
    expect(getBars()).toHaveLength(1)
  })
})
