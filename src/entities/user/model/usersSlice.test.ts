import { describe, it, expect } from 'vitest'
import reducer, {
  initialState,
  loadUsers,
  selectPopularUsers,
  selectNewUsers,
  SECTION_LIMIT,
} from './usersSlice'
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

const withUsers = (items: UserProfile[]) => ({ users: { items, status: 'succeeded' as const } })

describe('usersSlice', () => {
  it('ставит статус loading при начале загрузки', () => {
    expect(reducer(initialState, { type: loadUsers.pending.type }).status).toBe('loading')
  })

  it('сохраняет пользователей после загрузки', () => {
    const items = [makeUser(1, 10, '2020-01-01')]
    const state = reducer(initialState, { type: loadUsers.fulfilled.type, payload: items })
    expect(state.status).toBe('succeeded')
    expect(state.items).toEqual(items)
  })

  it('ставит статус failed при ошибке', () => {
    expect(reducer(initialState, { type: loadUsers.rejected.type }).status).toBe('failed')
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
})
