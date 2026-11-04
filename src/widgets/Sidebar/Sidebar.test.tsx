import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { Sidebar } from './Sidebar'
import filterReducer from '../../features/catalog-filter/model/filterSlice'

vi.mock('../../shared/ui/LinkButton', () => ({
  LinkButton: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}))

vi.mock('../../shared/ui/Checkbox', () => ({
  Checkbox: ({
    label,
    checked,
    onChange,
  }: {
    label: string
    checked?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  }) => (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  ),
}))

const categories = [
  { id: 0, category: 'Бизнес и карьера', icon: '', subcategories: ['Тайм-менеджмент'] },
  { id: 1, category: 'Иностранные языки', icon: '', subcategories: ['Английский'] },
]

const renderSidebar = () => {
  const store = configureStore({ reducer: { filter: filterReducer } })
  render(
    <Provider store={store}>
      <Sidebar categories={categories} />
    </Provider>,
  )
  return store
}

describe('Sidebar', () => {
  it('показывает категории навыков из пропсов', () => {
    renderSidebar()
    expect(screen.getByText('Бизнес и карьера')).toBeInTheDocument()
    expect(screen.getByText('Иностранные языки')).toBeInTheDocument()
  })

  it('сохраняет выбранный тип в store', async () => {
    const store = renderSidebar()
    await userEvent.click(screen.getByLabelText('Могу научить'))
    expect(store.getState().filter.skillType).toBe('teach')
  })

  it('сохраняет выбранный пол в store', async () => {
    const store = renderSidebar()
    await userEvent.click(screen.getByLabelText('Мужской'))
    expect(store.getState().filter.gender).toBe('male')
  })

  it('сохраняет выбранный город в store', async () => {
    const store = renderSidebar()
    await userEvent.click(screen.getByLabelText('Казань'))
    expect(store.getState().filter.cities).toEqual(['Казань'])
  })
})
