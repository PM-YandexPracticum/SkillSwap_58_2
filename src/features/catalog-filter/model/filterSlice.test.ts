import { describe, it, expect } from 'vitest'
import reducer, {
  initialState,
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
})
