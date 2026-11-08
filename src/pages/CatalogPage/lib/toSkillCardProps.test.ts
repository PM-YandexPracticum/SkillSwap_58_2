import { describe, it, expect } from 'vitest'
import { toSkillCardProps } from './toSkillCardProps'
import type { UserProfile, SkillCategory } from '../../../shared/types'

const user: UserProfile = {
  id: 0,
  name: 'Алексей',
  avatar: 'images/avatars/a.jpg',
  birth_date: '1988-03-14',
  gender: 'Мужской',
  city: 'Москва',
  likes: 1247,
  date_created: '2019-06-05',
  bio: '',
  can_teach: {
    name: 'Тайм-менеджмент и борьба с прокрастинацией',
    category: 'Бизнес и карьера',
    subcategory: 'Тайм-менеджмент',
    description: '',
    images: [],
  },
  want_to_learn: ['Английский', 'Неизвестное'],
}

const categories: SkillCategory[] = [
  { id: 1, category: 'Иностранные языки', icon: '', subcategories: ['Английский'] },
]

describe('toSkillCardProps', () => {
  it('собирает данные пользователя для карточки', () => {
    const props = toSkillCardProps(user, categories)
    expect(props.user).toEqual({
      avatar: '/db/images/avatars/a.jpg',
      name: 'Алексей',
      city: 'Москва',
      birth_date: '1988-03-14',
      likes: 1247,
    })
  })

  it('берёт подкатегорию и цвет категории для «Может научить»', () => {
    expect(toSkillCardProps(user, categories).canTeach).toEqual({
      label: 'Тайм-менеджмент',
      color: '#EEE7F7',
    })
  })

  it('подбирает цвет тегов «Хочет научиться» по категории', () => {
    const [english, unknown] = toSkillCardProps(user, categories).wantToLearn
    expect(english.color).toBe('#EBE5C5')
    expect(unknown.color).toBe('#E7F2F6')
  })
})
