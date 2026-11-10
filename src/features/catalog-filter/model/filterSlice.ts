import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchSkillCategories } from '../../../api/skills'
import { fetchCities } from '../../../api/cities'
import type { SkillCategory, City } from '../../../shared/types'

export type SkillTypeFilter = 'all' | 'learn' | 'teach'
export type GenderFilter = 'any' | 'male' | 'female'
export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface FilterState {
  skillType: SkillTypeFilter
  skills: string[]
  gender: GenderFilter
  cities: string[]
  categoryOptions: Omit<SkillCategory, 'color'>[]
  searchQuery: string
  cityOptions: City[]
  status: LoadingStatus
}

export const initialState: FilterState = {
  skillType: 'all',
  skills: [],
  gender: 'any',
  cities: [],
  searchQuery: '',
  categoryOptions: [],
  cityOptions: [],
  status: 'idle',
}

export const loadFilterOptions = createAsyncThunk('filter/loadOptions', async () => {
  const [categories, cities] = await Promise.all([fetchSkillCategories(), fetchCities()])
  return { categories, cities }
})

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
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },
    resetFilters(state) {
      state.skillType = initialState.skillType
      state.skills = []
      state.gender = initialState.gender
      state.cities = []
      state.searchQuery = initialState.searchQuery
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFilterOptions.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loadFilterOptions.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.categoryOptions = action.payload.categories
        state.cityOptions = action.payload.cities
      })
      .addCase(loadFilterOptions.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export const {
  setSkillType,
  setSkills,
  setGender,
  setCities,
  setSearchQuery,
  resetFilters,
} = filterSlice.actions

type StateWithFilter = { filter: FilterState }
export const selectFilter = (state: StateWithFilter) => state.filter
export const selectCategoryOptions = (state: StateWithFilter) => state.filter.categoryOptions
export const selectCityOptions = (state: StateWithFilter) => state.filter.cityOptions
export const selectFilterStatus = (state: StateWithFilter) => state.filter.status
export const selectActiveFilterCount = (state: StateWithFilter) => {
  const { skillType, skills, gender, cities, searchQuery } = state.filter
  return (
    Number(skillType !== 'all') +
    skills.length +
    Number(gender !== 'any') +
    cities.length +
    Number(searchQuery.trim().length > 0)
  )
}

export default filterSlice.reducer
