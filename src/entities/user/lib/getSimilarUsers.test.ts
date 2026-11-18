import { describe, expect, it } from 'vitest'
import type { UserProfile } from '@/shared/types'
import { getSimilarUsers } from './getSimilarUsers'

const makeUser = (id: number, category: string, subcategory: string): UserProfile => ({
  id,
  name: `Пользователь ${id}`,
  avatar: `images/avatars/${id}.jpg`,
  birth_date: '1990-01-01',
  gender: 'Мужской',
  city: 'Москва',
  likes: 0,
  date_created: '2020-01-01',
  bio: '',
  can_teach: {
    name: `Навык ${id}`,
    category,
    subcategory,
    description: '',
    images: [],
  },
  want_to_learn: [],
})

const ids = (list: UserProfile[]) => list.map((item) => item.id)

describe('getSimilarUsers', () => {
  it('берёт только пользователей из той же категории', () => {
    const current = makeUser(0, 'Бизнес и карьера', 'Тайм-менеджмент')
    const users = [
      current,
      makeUser(1, 'Бизнес и карьера', 'Тайм-менеджмент'),
      makeUser(2, 'Иностранные языки', 'Английский'),
      makeUser(3, 'Бизнес и карьера', 'Личный бренд'),
    ]

    expect(ids(getSimilarUsers(users, current, 8))).toEqual([1, 3])
  })

  it('не включает самого пользователя', () => {
    const current = makeUser(0, 'Бизнес и карьера', 'Тайм-менеджмент')

    expect(getSimilarUsers([current], current, 8)).toEqual([])
  })

  it('ставит выше тех, у кого совпала подкатегория', () => {
    const current = makeUser(0, 'Творчество и искусство', 'Фотография')
    const users = [
      current,
      makeUser(1, 'Творчество и искусство', 'Музыка и звук'),
      makeUser(2, 'Творчество и искусство', 'Фотография'),
      makeUser(3, 'Творчество и искусство', 'Рисование и иллюстрация'),
      makeUser(4, 'Творчество и искусство', 'Фотография'),
    ]

    expect(ids(getSimilarUsers(users, current, 8))).toEqual([2, 4, 1, 3])
  })

  it('ограничивает количество карточек', () => {
    const current = makeUser(0, 'Творчество и искусство', 'Фотография')
    const users = [
      current,
      ...Array.from({ length: 10 }, (_, index) =>
        makeUser(index + 1, 'Творчество и искусство', 'Фотография'),
      ),
    ]

    expect(ids(getSimilarUsers(users, current, 8))).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('возвращает пустой список, если похожих нет', () => {
    const current = makeUser(0, 'Дом и уют', 'Ремонт')
    const users = [current, makeUser(1, 'Иностранные языки', 'Английский')]

    expect(getSimilarUsers(users, current, 8)).toEqual([])
  })

  it('не меняет исходный массив', () => {
    const current = makeUser(0, 'Творчество и искусство', 'Фотография')
    const users = [
      current,
      makeUser(1, 'Творчество и искусство', 'Музыка и звук'),
      makeUser(2, 'Творчество и искусство', 'Фотография'),
    ]
    const before = ids(users)

    getSimilarUsers(users, current, 8)

    expect(ids(users)).toEqual(before)
  })
})
