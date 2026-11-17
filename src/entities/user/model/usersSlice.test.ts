import { describe, it, expect } from 'vitest'
import reducer, {
  initialState,
  loadUsers,
  showMoreRecommended,
  selectPopularUsers,
  selectNewUsers,
  selectRecommendedUsers,
  selectHasMoreRecommended,
  SECTION_LIMIT,
  RECOMMENDED_STEP,
} from './usersSlice'
import type { UsersState } from './usersSlice'
import type { UserProfile } from '../../../shared/types'

const makeUser = (id: number, likes: number, date_created: string): UserProfile => ({
  id,
  name: `User ${id}`,
  avatar: '',
  birth_date: '2000-01-01',
  gender: 'Мужской',
  city: 'Москва',
  likes,
  date_created,
  bio: '',
  can_teach: { name: '', category: '', subcategory: '', description: '', images: [] },
  want_to_learn: [],
})

const withUsers = (items: UserProfile[], extra: Partial<UsersState> = {}) => ({
  users: { ...initialState, items, status: 'succeeded' as const, ...extra },
})

describe('usersSlice', () => {
  it('ставит статус loading при начале загрузки', () => {
    expect(reducer(initialState, { type: loadUsers.pending.type }).status).toBe('loading')
  })

  it('сохраняет пользователей и порядок рекомендаций после загрузки', () => {
    const items = Array.from({ length: 10 }, (_, i) => makeUser(i, i, '2020-01-01'))
    const recommendedOrder = [3, 1, 7, 0, 9, 2, 5, 8, 4, 6]
    const state = reducer(initialState, {
      type: loadUsers.fulfilled.type,
      payload: { items, recommendedOrder },
    })
    expect(state.status).toBe('succeeded')
    expect(state.items).toEqual(items)
    expect(state.recommendedOrder).toEqual(recommendedOrder)
    expect(state.recommendedCount).toBe(RECOMMENDED_STEP)
  })

  it('сохраняет причину ошибки и очищает её при новой загрузке', () => {
    const message = 'Не удалось загрузить пользователей'
    const failed = reducer(initialState, loadUsers.rejected(new Error(message), 'request'))
    expect(failed).toMatchObject({ status: 'failed', error: message })
    expect(reducer(failed, loadUsers.pending('retry'))).toMatchObject({
      status: 'loading',
      error: '',
    })
  })

  it('популярное: сортировка по убыванию лайков', () => {
    const state = withUsers([
      makeUser(1, 10, '2020-01-01'),
      makeUser(2, 50, '2021-01-01'),
      makeUser(3, 30, '2022-01-01'),
    ])
    expect(selectPopularUsers(state).map((u) => u.id)).toEqual([2, 3, 1])
  })

  it('новое: сортировка от новых к старым', () => {
    const state = withUsers([
      makeUser(1, 10, '2020-01-01'),
      makeUser(2, 50, '2023-05-01'),
      makeUser(3, 30, '2021-03-10'),
    ])
    expect(selectNewUsers(state).map((u) => u.id)).toEqual([2, 3, 1])
  })

  it('отдаёт не больше 9 пользователей в секцию', () => {
    const many = Array.from({ length: 12 }, (_, i) => makeUser(i, i, `2020-01-${10 + i}`))
    expect(selectPopularUsers(withUsers(many))).toHaveLength(SECTION_LIMIT)
    expect(selectNewUsers(withUsers(many))).toHaveLength(SECTION_LIMIT)
  })

  it('рекомендуемые: отдаёт пользователей в перемешанном порядке и нужном количестве', () => {
    const items = [makeUser(1, 0, ''), makeUser(2, 0, ''), makeUser(3, 0, '')]
    const state = withUsers(items, { recommendedOrder: [3, 1, 2], recommendedCount: 2 })
    expect(selectRecommendedUsers(state).map((u) => u.id)).toEqual([3, 1])
    expect(selectHasMoreRecommended(state)).toBe(true)
  })

  it('showMoreRecommended добавляет 6 и не выходит за пределы списка', () => {
    const start: UsersState = {
      ...initialState,
      recommendedOrder: Array.from({ length: 10 }, (_, i) => i),
      recommendedCount: 6,
    }
    const state = reducer(start, showMoreRecommended())
    expect(state.recommendedCount).toBe(10)
    expect(selectHasMoreRecommended({ users: state })).toBe(false)
  })
})
