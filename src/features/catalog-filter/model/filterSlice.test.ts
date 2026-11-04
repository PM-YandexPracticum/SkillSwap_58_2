import { describe, it, expect } from 'vitest'
import reducer, {
  initialState,
  loadFilterOptions,
  setSkillType,
  setSkills,
  setGender,
  setCities,
  resetFilters,
} from './filterSlice'

describe('filterSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('меняет тип навыка', () => {
    expect(reducer(initialState, setSkillType('teach')).skillType).toBe('teach')
  })

  it('сохраняет выбранные навыки и города', () => {
    let state = reducer(initialState, setSkills(['Английский', 'Ремонт']))
    state = reducer(state, setCities(['Казань']))
    expect(state.skills).toEqual(['Английский', 'Ремонт'])
    expect(state.cities).toEqual(['Казань'])
  })

  it('меняет пол автора', () => {
    expect(reducer(initialState, setGender('female')).gender).toBe('female')
  })

  it('сбрасывает фильтры', () => {
    const changed = reducer(initialState, setGender('male'))
    expect(reducer(changed, resetFilters())).toEqual(initialState)
  })

  it('ставит статус loading при начале загрузки', () => {
    const state = reducer(initialState, { type: loadFilterOptions.pending.type })
    expect(state.status).toBe('loading')
  })

  it('сохраняет категории и города после загрузки', () => {
    const payload = {
      categories: [{ id: 0, category: 'Дом и уют', icon: '', subcategories: ['Ремонт'] }],
      cities: [{ id: '1', name: 'Москва' }],
    }
    const state = reducer(initialState, { type: loadFilterOptions.fulfilled.type, payload })
    expect(state.status).toBe('succeeded')
    expect(state.categoryOptions).toEqual(payload.categories)
    expect(state.cityOptions).toEqual(payload.cities)
  })

  it('ставит статус failed при ошибке', () => {
    const state = reducer(initialState, { type: loadFilterOptions.rejected.type })
    expect(state.status).toBe('failed')
  })

  it('сброс не удаляет загруженные категории и города', () => {
    const loaded = {
      ...initialState,
      cityOptions: [{ id: '1', name: 'Москва' }],
      cities: ['Москва'],
    }
    const state = reducer(loaded, resetFilters())
    expect(state.cities).toEqual([])
    expect(state.cityOptions).toEqual([{ id: '1', name: 'Москва' }])
  })
})
