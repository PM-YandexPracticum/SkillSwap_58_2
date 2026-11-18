import type { UserProfile } from '@/shared/types'

export function getSimilarUsers(
  users: UserProfile[],
  user: UserProfile,
  limit: number,
): UserProfile[] {
  const { category, subcategory } = user.can_teach

  const sameCategory = users.filter(
    (item) => item.id !== user.id && item.can_teach.category === category,
  )
  const sameSubcategory = sameCategory.filter((item) => item.can_teach.subcategory === subcategory)
  const otherSubcategory = sameCategory.filter((item) => item.can_teach.subcategory !== subcategory)

  return [...sameSubcategory, ...otherSubcategory].slice(0, limit)
}
