import { fetchSkillCategories } from "@/api/skills"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { SkillCategory } from "../types"

export interface SkillCategoriesState {
  skillCategories: SkillCategory[]
  loading: boolean
}

const initialState: SkillCategoriesState = {
  skillCategories: [],
  loading: false,
}

export const loadSkillCategories = createAsyncThunk('skillCategories/load', async () => fetchSkillCategories())

const skillCategoriesSlice = createSlice({
  name: 'skillCategories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSkillCategories.pending, (state) => {
        state.loading = true
      })
      .addCase(loadSkillCategories.fulfilled, (state, action) => {
        state.loading = false
        state.skillCategories = action.payload
      })
      .addCase(loadSkillCategories.rejected, (state) => {
        state.loading = false
      })
  },
})

export default skillCategoriesSlice.reducer;