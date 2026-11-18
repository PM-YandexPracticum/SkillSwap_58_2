import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import filterReducer, {
  initialState as filterInitialState,
} from '@/features/catalog-filter/model/filterSlice'
import usersReducer, { initialState as usersInitialState } from '@/entities/user/model/usersSlice'
import authReducer from '@/features/auth/model/authSlice'
import exchangeReducer from '@/features/exchange/model/exchangeSlice'
import type { UserProfile } from '@/shared/types'
import SkillPage from './index'

vi.mock('@/shared/assets/icons/Share.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/More.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Clock.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/BellLarge.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/ui/Like/Like', () => ({
  LikeComponent: ({ counter }: { counter?: number }) => <span data-testid="like">{counter}</span>,
}))
vi.mock('@/shared/ui/Gallery', () => ({
  Gallery: ({ images }: { images: { src: string }[] }) => (
    <div data-testid="gallery">{images.map((image) => image.src).join(',')}</div>
  ),
}))
vi.mock('@/widgets/Sections/SliderSection', () => ({
  SliderSection: ({ title, children }: { title: string; children: ReactNode }) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}))

const makeUser = (
  id: number,
  name: string,
  teach: string,
  category = 'Творчество и искусство',
  subcategory = 'Музыка и звук',
): UserProfile => ({
  id,
  name,
  avatar: `images/avatars/${id}.jpg`,
  birth_date: '1990-01-01',
  gender: 'Мужской',
  city: 'Москва',
  likes: 10 + id,
  date_created: '2020-01-01',
  bio: `О себе: ${name}`,
  can_teach: {
    name: teach,
    category,
    subcategory,
    description: `Описание: ${teach}`,
    images: [`images/skills/${id}-1.jpg`, `images/skills/${id}-2.jpg`],
  },
  want_to_learn: ['Медитация'],
})

const users = [
  makeUser(0, 'Иван', 'Игра на барабанах'),
  makeUser(1, 'Илона', 'Английский язык', 'Иностранные языки', 'Английский'),
  makeUser(2, 'Михаил', 'Фотография', 'Творчество и искусство', 'Фотография'),
  makeUser(3, 'Анна', 'Игра на гитаре'),
]

const renderPage = (path: string, usersStatus: 'succeeded' | 'failed' | 'idle' = 'succeeded') => {
  localStorage.clear()
  const store = configureStore({
    reducer: {
      filter: filterReducer,
      users: usersReducer,
      auth: authReducer,
      exchange: exchangeReducer,
    },
    preloadedState: {
      filter: { ...filterInitialState, status: 'succeeded' as const },
      users: {
        ...usersInitialState,
        items: usersStatus === 'succeeded' ? users : [],
        status: usersStatus,
      },
      auth: {
        user: { id: '5', name: 'Алексей', email: 'a@example.com', token: 't' },
        status: 'idle' as const,
        error: null,
      },
    },
  })

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/skill/:id" element={<SkillPage />} />
          <Route path="/not-found" element={<main>Страница не найдена</main>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
}

describe('SkillPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('показывает навык и профиль выбранного пользователя по id из адреса (в том числе id = 0)', () => {
    renderPage('/skill/0')

    expect(screen.getByRole('heading', { level: 1, name: 'Игра на барабанах' })).toBeInTheDocument()
    expect(screen.getByText('Творчество и искусство / Музыка и звук')).toBeInTheDocument()
    expect(screen.getByText('Описание: Игра на барабанах')).toBeInTheDocument()
    expect(screen.getByText('О себе: Иван')).toBeInTheDocument()
    expect(screen.getByText('Может научить')).toBeInTheDocument()
    expect(screen.getByText('Хочет научиться')).toBeInTheDocument()
  })

  it('передаёт в галерею фото навыка из папки /db', () => {
    renderPage('/skill/1')

    expect(screen.getByTestId('gallery')).toHaveTextContent(
      '/db/images/skills/1-1.jpg,/db/images/skills/1-2.jpg',
    )
  })

  it('в «Похожих предложениях» показывает людей из той же категории, но не выбранного', () => {
    renderPage('/skill/0')

    expect(screen.getByRole('heading', { name: 'Похожие предложения' })).toBeInTheDocument()
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(2)
    expect(screen.queryByText('Илона')).not.toBeInTheDocument()
    expect(screen.queryByText('Иван', { selector: 'article *' })).not.toBeInTheDocument()
    // сначала тот, у кого совпала подкатегория («Музыка и звук»)
    expect(within(cards[0]).getByText('Анна')).toBeInTheDocument()
    expect(within(cards[1]).getByText('Михаил')).toBeInTheDocument()
  })

  it('если похожих предложений нет, блок не показывается', () => {
    renderPage('/skill/1')

    expect(screen.getByRole('heading', { level: 1, name: 'Английский язык' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Похожие предложения' })).not.toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('кнопка «Предложить обмен» открывает окно, а после закрытия кнопка меняется', async () => {
    const user = userEvent.setup()
    renderPage('/skill/0')

    await user.click(screen.getByRole('button', { name: 'Предложить обмен' }))

    const dialog = screen.getByRole('dialog', { name: 'Вы предложили обмен' })
    expect(dialog).toBeInTheDocument()
    expect(
      screen.getByText('Теперь дождитесь подтверждения. Вам придёт уведомление'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Готово' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Обмен предложен' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Предложить обмен' })).not.toBeInTheDocument()
  })

  it.each(['/skill/99', '/skill/abc'])(
    'для несуществующего навыка %s ведёт на страницу 404',
    (path) => {
      renderPage(path)

      expect(screen.getByText('Страница не найдена')).toBeInTheDocument()
    },
  )

  it('пока пользователи не загружены, ничего не показывает', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))
    renderPage('/skill/0', 'idle')

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })

  it('при ошибке загрузки сообщает о ней', () => {
    renderPage('/skill/0', 'failed')

    expect(screen.getByText('Не удалось загрузить страницу навыка')).toBeInTheDocument()
  })
})
