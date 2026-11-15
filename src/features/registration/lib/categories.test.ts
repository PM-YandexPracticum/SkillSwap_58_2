import { describe, it, expect } from 'vitest'
import { findCategoryOf, getSubcategoriesOf, keepSubcategoriesOf } from './categories'

const categories = [
  { category: 'Языки', subcategories: ['Английский', 'Немецкий'] },
  { category: 'Творчество', subcategories: ['Рисование', 'Фотография'] },
]

describe('связка категорий и подкатегорий', () => {
  it('показывает подкатегории только выбранных категорий', () => {
    expect(getSubcategoriesOf(categories, ['Языки'])).toEqual(['Английский', 'Немецкий'])
    expect(getSubcategoriesOf(categories, [])).toEqual([])
  })

  it('при снятии категории убирает её подкатегории', () => {
    expect(keepSubcategoriesOf(categories, ['Творчество'], ['Английский', 'Рисование'])).toEqual([
      'Рисование',
    ])
  })

  it('находит категорию по подкатегории', () => {
    expect(findCategoryOf(categories, 'Фотография')).toBe('Творчество')
    expect(findCategoryOf(categories, 'Нет такой')).toBe('')
  })
})
