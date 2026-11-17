import { configureStore } from '@reduxjs/toolkit'
import { describe, expect, it, vi } from 'vitest'
import { fetchSkillCategories } from '@/api/skills'
import reducer, { loadSkillCategories } from './skillCategoriesSlice'

vi.mock('@/api/skills', () => ({ fetchSkillCategories: vi.fn() }))

describe('loadSkillCategories', () => {
  it('не запускает повторную загрузку, пока не завершилась первая', async () => {
    const categories = [
      { id: 0, category: 'Языки', icon: '', subcategories: ['Английский'], color: '#fff' },
    ]
    vi.mocked(fetchSkillCategories)
      .mockResolvedValueOnce(categories)
      .mockRejectedValueOnce(new Error('Ошибка повторного запроса'))
    const store = configureStore({ reducer: { skillCategories: reducer } })

    await Promise.all([store.dispatch(loadSkillCategories()), store.dispatch(loadSkillCategories())])

    expect(fetchSkillCategories).toHaveBeenCalledTimes(1)
    expect(store.getState().skillCategories).toMatchObject({
      skillCategories: categories,
      loading: false,
      error: '',
    })
  })
})
