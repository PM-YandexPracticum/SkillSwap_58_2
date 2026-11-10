import { describe, expect, it } from 'vitest'
import type { UserProfile } from '../../../shared/types'
import { initialState } from './filterSlice'
import { filterUsers } from './filterUsers'

const makeUser = (
  id: number,
  gender: string,
  city: string,
  teach: string,
  learn: string[],
): UserProfile => ({
  id,
  name: `User ${id}`,
  avatar: '',
  birth_date: '2000-01-01',
  gender,
  city,
  likes: 0,
  date_created: '2025-01-01',
  bio: '',
  can_teach: {
    name: teach,
    category: '',
    subcategory: teach,
    description: '',
    images: [],
  },
  want_to_learn: learn,
})

const users = [
  makeUser(1, 'Женский', 'Москва', 'Рисование', ['Английский']),
  makeUser(2, 'Мужской', 'Казань', 'Английский', ['Музыка']),
  makeUser(3, 'Женский', 'Казань', 'Музыка', ['Рисование']),
]

describe('filterUsers', () => {
  it('возвращает исходный список без активных фильтров', () => {
    expect(filterUsers(users, initialState)).toEqual(users)
  })

  it('фильтрует одновременно по навыкам, полу и городу', () => {
    expect(
      filterUsers(users, {
        ...initialState,
        skills: ['Английский'],
        gender: 'male',
        cities: ['Казань'],
      }).map((user) => user.id),
    ).toEqual([2])
  })

  it('ищет только среди навыков выбранного направления', () => {
    expect(
      filterUsers(users, { ...initialState, skillType: 'teach', searchQuery: 'англ' }).map(
        (user) => user.id,
      ),
    ).toEqual([2])
    expect(
      filterUsers(users, { ...initialState, skillType: 'learn', searchQuery: 'англ' }).map(
        (user) => user.id,
      ),
    ).toEqual([1])
  })

  it('учитывает несколько выбранных навыков как альтернативы', () => {
    expect(
      filterUsers(users, {
        ...initialState,
        skills: ['Музыка', 'Рисование'],
      }).map((user) => user.id),
    ).toEqual([1, 2, 3])
  })
})
