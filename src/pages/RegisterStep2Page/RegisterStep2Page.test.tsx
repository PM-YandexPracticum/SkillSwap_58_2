import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import filterReducer, { initialState } from '@/features/catalog-filter/model/filterSlice'
import registrationReducer from '@/features/registration/model/registrationSlice'
import {
  EMPTY_DRAFT,
  type RegistrationDraft,
} from '@/features/registration/model/registrationStorage'
import RegisterStep2Page from './index'

vi.mock('@/shared/assets/icons/Logo.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Add.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Cross.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Chevron.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/CheckboxEmpty.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/CheckboxDone.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/CheckboxRemove.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/ui/DatePicker/DatePicker', () => ({ DatePickerComponent: () => null }))
vi.mock('@/shared/ui/DownloadAvatar/AvatarUploader', () => ({ AvatarUploader: () => null }))
vi.mock('@/shared/ui/Input/ImageInput/ImageInput', () => ({ ImageInput: () => null }))

const categories: typeof initialState.categoryOptions = [
  { id: 0, icon: '', category: 'Языки', subcategories: ['Английский', 'Немецкий'] },
  { id: 1, icon: '', category: 'Творчество', subcategories: ['Рисование', 'Фотография'] },
]

function renderPage(draft: Partial<RegistrationDraft> = {}) {
  const store = configureStore({
    reducer: { filter: filterReducer, registration: registrationReducer },
    preloadedState: {
      filter: { ...initialState, categoryOptions: categories, status: 'succeeded' as const },
      registration: {
        draft: {
          ...EMPTY_DRAFT,
          name: 'Анна',
          birthDate: '01.01.1990',
          gender: 'female',
          city: 'Москва',
          ...draft,
        },
        completedStep: 1 as const,
        status: 'idle' as const,
        error: null,
      },
    },
  })
  const view = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/register/step2']}>
        <Routes>
          <Route path="/register/step2" element={<RegisterStep2Page />} />
          <Route path="/register/step3" element={<p>Третий шаг</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
  return { store, ...view }
}

const categoryTrigger = () =>
  within(screen.getByText('Категория навыка, которому хотите научиться').parentElement!).getByRole(
    'button',
  )
const subcategoryTrigger = () =>
  within(
    screen.getByText('Подкатегория навыка, которому хотите научиться').parentElement!,
  ).getByRole('button')

describe('выбор навыков на втором шаге регистрации', () => {
  beforeEach(() => sessionStorage.clear())

  it('позволяет начать с подкатегорий разных категорий и снять выбор через лейблы', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(subcategoryTrigger())
    expect(screen.getAllByRole('checkbox')).toHaveLength(4)
    await user.click(screen.getByRole('checkbox', { name: 'Английский' }))
    await user.click(screen.getByRole('checkbox', { name: 'Фотография' }))
    expect(screen.getByRole('list', { name: 'Выбранные подкатегории' }).children).toHaveLength(2)
    await user.click(categoryTrigger())
    expect(screen.getByRole('checkbox', { name: 'Языки' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Творчество' })).toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Удалить фильтр Английский' }))
    await user.click(categoryTrigger())
    expect(screen.getByRole('checkbox', { name: 'Языки' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Творчество' })).toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Удалить фильтр Фотография' }))
    expect(screen.queryByRole('list', { name: 'Выбранные подкатегории' })).not.toBeInTheDocument()
    expect(categoryTrigger()).toHaveTextContent('Выберите категорию')
    await user.click(subcategoryTrigger())
    expect(screen.getAllByRole('checkbox')).toHaveLength(4)
  })

  it('фильтрует по выбранным вручную категориям и очищает их подкатегории при снятии', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(categoryTrigger())
    await user.click(screen.getByRole('checkbox', { name: 'Языки' }))
    await user.click(subcategoryTrigger())
    expect(screen.getAllByRole('checkbox')).toHaveLength(2)
    expect(screen.queryByRole('checkbox', { name: 'Фотография' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('checkbox', { name: 'Английский' }))
    await user.click(screen.getByRole('button', { name: 'Удалить фильтр Английский' }))
    expect(categoryTrigger()).toHaveTextContent('Языки')
    await user.click(subcategoryTrigger())
    await user.click(screen.getByRole('checkbox', { name: 'Немецкий' }))
    await user.click(categoryTrigger())
    await user.click(screen.getByRole('checkbox', { name: 'Языки' }))
    expect(screen.queryByRole('list', { name: 'Выбранные подкатегории' })).not.toBeInTheDocument()
    await user.click(subcategoryTrigger())
    expect(screen.getAllByRole('checkbox')).toHaveLength(4)
  })

  it('сохраняет автоматически выбранную категорию и восстанавливает выбранные лейблы', async () => {
    const user = userEvent.setup()
    const { store, unmount } = renderPage()
    await user.click(subcategoryTrigger())
    await user.click(screen.getByRole('checkbox', { name: 'Английский' }))
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(await screen.findByText('Третий шаг')).toBeInTheDocument()
    const draft = store.getState().registration.draft
    expect(draft.learnCategories).toEqual(['Языки'])
    expect(draft.learnSubcategories).toEqual(['Английский'])
    unmount()
    renderPage(draft)
    expect(screen.getByRole('button', { name: 'Удалить фильтр Английский' })).toBeInTheDocument()
    await user.click(subcategoryTrigger())
    expect(screen.getByRole('checkbox', { name: 'Английский' })).toBeChecked()
  })
})
