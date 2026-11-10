import type { UserProfile } from '../../../shared/types'
import type { FilterState } from './filterSlice'

const normalize = (value: string) => value.trim().toLocaleLowerCase('ru')

export function filterUsers(users: UserProfile[], filter: FilterState): UserProfile[] {
  const query = normalize(filter.searchQuery)

  return users.filter((user) => {
    if (filter.gender !== 'any') {
      const expectedGender = filter.gender === 'male' ? 'Мужской' : 'Женский'
      if (user.gender !== expectedGender) return false
    }

    if (filter.cities.length > 0 && !filter.cities.includes(user.city)) return false

    const userSkills = [
      ...(filter.skillType === 'learn' ? [] : [{
        filterValue: user.can_teach.subcategory,
        searchableText: `${user.can_teach.name} ${user.can_teach.subcategory}`,
      }]),
      ...(filter.skillType === 'teach'
        ? []
        : user.want_to_learn.map((skill) => ({ filterValue: skill, searchableText: skill }))),
    ]

    if (
      filter.skills.length > 0 &&
      !filter.skills.some((skill) => userSkills.some((userSkill) => userSkill.filterValue === skill))
    ) {
      return false
    }

    if (query && !userSkills.some((skill) => normalize(skill.searchableText).includes(query))) {
      return false
    }

    return true
  })
}

export const hasActiveFilters = (filter: FilterState) =>
  filter.skillType !== 'all' ||
  filter.skills.length > 0 ||
  filter.gender !== 'any' ||
  filter.cities.length > 0 ||
  filter.searchQuery.trim().length > 0
