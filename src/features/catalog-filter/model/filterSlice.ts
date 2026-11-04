import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type SkillTypeFilter = 'all' | 'learn' | 'teach'
export type GenderFilter = 'any' | 'male' | 'female'

export interface FilterState {
  skillType: SkillTypeFilter
  skills: string[]
  gender: GenderFilter
  cities: string[]
}

export const initialState: FilterState = {
  skillType: 'all',
  skills: [],
  gender: 'any',
  cities: [],
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSkillType(state, action: PayloadAction<SkillTypeFilter>) {
      state.skillType = action.payload
    },
    setSkills(state, action: PayloadAction<string[]>) {
      state.skills = action.payload
    },
    setGender(state, action: PayloadAction<GenderFilter>) {
      state.gender = action.payload
    },
    setCities(state, action: PayloadAction<string[]>) {
      state.cities = action.payload
    },
    resetFilters() {
      return initialState
    },
  },
})

export const { setSkillType, setSkills, setGender, setCities, resetFilters } = filterSlice.actions

export const selectFilter = (state: { filter: FilterState }) => state.filter

export default filterSlice.reducer
