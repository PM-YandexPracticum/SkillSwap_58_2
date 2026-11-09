import { configureStore } from '@reduxjs/toolkit'
import filterReducer from '../features/catalog-filter/model/filterSlice'
import usersReducer from '../entities/user/model/usersSlice'
import skillCategoriesReducer from '../entities/skills/model/skillCategoriesSlice'
// Импортируй свои slice'ы здесь по мере их создания:
// import skillsReducer from '@/entities/skill/model/skillsSlice'
// import authReducer from '@/features/auth/model/authSlice'

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    users: usersReducer,
    skillCategories: skillCategoriesReducer,
    // skills: skillsReducer,
    // auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch