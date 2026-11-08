import type { SkillCardProps } from '../../../widgets/SkillCard'
import type { SkillCategory, UserProfile } from '../../../shared/types'
import { getCategoryColor } from '../../../shared/lib/categoryColors'

const findCategoryName = (subcategory: string, categories: SkillCategory[]) =>
  categories.find((category) => category.subcategories.includes(subcategory))?.category

export const toSkillCardProps = (
  user: UserProfile,
  categories: SkillCategory[],
): Pick<SkillCardProps, 'user' | 'canTeach' | 'wantToLearn'> => ({
  user: {
    avatar: `/db/${user.avatar}`,
    name: user.name,
    city: user.city,
    birth_date: user.birth_date,
    likes: user.likes,
  },
  canTeach: {
    label: user.can_teach.subcategory,
    color: getCategoryColor(user.can_teach.category),
  },
  wantToLearn: user.want_to_learn.map((label) => ({
    label,
    color: getCategoryColor(findCategoryName(label, categories)),
  })),
})
