import { configureStore } from '@reduxjs/toolkit'
import filterReducer from '../features/catalog-filter/model/filterSlice'
import usersReducer from '../entities/user/model/usersSlice'
import authReducer from '../features/auth/model/authSlice'
import skillCategoriesReducer from '../entities/skills/model/skillCategoriesSlice'
import exchangeReducer from '../features/exchange/model/exchangeSlice'
// Импортируй свои slice'ы здесь по мере их создания:
// import skillsReducer from '@/entities/skill/model/skillsSlice'

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    users: usersReducer,
    auth: authReducer,
    skillCategories: skillCategoriesReducer,
    exchange: exchangeReducer,
    // skills: skillsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
