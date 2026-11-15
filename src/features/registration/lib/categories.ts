import type { SkillCategory } from '@/shared/types'

type CategoryLike = Pick<SkillCategory, 'category' | 'subcategories'>

/** Подкатегории только выбранных категорий */
export function getSubcategoriesOf(categories: CategoryLike[], selected: string[]): string[] {
  return categories
    .filter((item) => selected.includes(item.category))
    .flatMap((item) => item.subcategories)
}

/** Оставляет только те подкатегории, чья категория всё ещё выбрана */
export function keepSubcategoriesOf(
  categories: CategoryLike[],
  selectedCategories: string[],
  subcategories: string[],
): string[] {
  const allowed = new Set(getSubcategoriesOf(categories, selectedCategories))
  return subcategories.filter((item) => allowed.has(item))
}

/** Категория, к которой относится подкатегория */
export function findCategoryOf(categories: CategoryLike[], subcategory: string): string {
  return categories.find((item) => item.subcategories.includes(subcategory))?.category ?? ''
}
