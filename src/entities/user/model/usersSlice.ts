import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { fetchUserProfiles } from '../../../api/users'
import type { UserProfile } from '../../../shared/types'
import { getRegisteredUsers, toProfile } from './registeredUsers'

export const SECTION_LIMIT = 9
export const RECOMMENDED_STEP = 6

export type UsersStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface UsersState {
  items: UserProfile[]
  status: UsersStatus
  error: string
  recommendedOrder: number[]
  recommendedCount: number
}

export const initialState: UsersState = {
  items: [],
  status: 'idle',
  error: '',
  recommendedOrder: [],
  recommendedCount: 0,
}

const shuffle = <T>(array: T[]): T[] => {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export const loadUsers = createAsyncThunk.withTypes<{ state: { users: UsersState } }>()(
  'users/load',
  async () => {
    const items = [...(await fetchUserProfiles()), ...getRegisteredUsers().map(toProfile)]
    return { items, recommendedOrder: shuffle(items.map((user) => user.id)) }
  },
  {
    condition: (_, { getState }) =>
      getState().users.status !== 'loading',
  },
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    showMoreRecommended(state) {
      state.recommendedCount = Math.min(
        state.recommendedCount + RECOMMENDED_STEP,
        state.recommendedOrder.length,
      )
    },
    /** Новый пользователь после регистрации — сразу появляется в каталоге */
    addUser(state, action: PayloadAction<UserProfile>) {
      // если список ещё не загружен, пользователь подтянется из localStorage при загрузке
      if (state.status !== 'succeeded') return
      if (state.items.some((user) => user.id === action.payload.id)) return
      state.items.push(action.payload)
      state.recommendedOrder.unshift(action.payload.id)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.status = 'loading'
        state.error = ''
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.recommendedOrder = action.payload.recommendedOrder
        state.recommendedCount = Math.min(RECOMMENDED_STEP, action.payload.recommendedOrder.length)
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error?.message || 'Не удалось загрузить пользователей'
      })
  },
})

export const { showMoreRecommended, addUser } = usersSlice.actions

type StateWithUsers = { users: UsersState }

export const selectUsers = (state: StateWithUsers) => state.users.items
export const selectUsersStatus = (state: StateWithUsers) => state.users.status
const selectRecommendedOrder = (state: StateWithUsers) => state.users.recommendedOrder
const selectRecommendedCount = (state: StateWithUsers) => state.users.recommendedCount

export const selectPopularUsers = createSelector([selectUsers], (users) =>
  [...users].sort((a, b) => b.likes - a.likes).slice(0, SECTION_LIMIT),
)

export const selectNewUsers = createSelector([selectUsers], (users) =>
  [...users].sort((a, b) => b.date_created.localeCompare(a.date_created)).slice(0, SECTION_LIMIT),
)

export const selectRecommendedUsers = createSelector(
  [selectUsers, selectRecommendedOrder, selectRecommendedCount],
  (users, order, count) => {
    const usersById = new Map(users.map((user) => [user.id, user]))
    return order
      .slice(0, count)
      .map((id) => usersById.get(id))
      .filter((user): user is UserProfile => user !== undefined)
  },
)

export const selectHasMoreRecommended = (state: StateWithUsers) =>
  state.users.recommendedCount < state.users.recommendedOrder.length

export default usersSlice.reducer
export const selectUsersError = (state: StateWithUsers) => state.users.error
