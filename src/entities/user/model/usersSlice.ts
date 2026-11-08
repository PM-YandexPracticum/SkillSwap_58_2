import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { fetchUserProfiles } from '../../../api/users'
import type { UserProfile } from '../../../shared/types'

export const SECTION_LIMIT = 9

export type UsersStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface UsersState {
  items: UserProfile[]
  status: UsersStatus
}

export const initialState: UsersState = {
  items: [],
  status: 'idle',
}

export const loadUsers = createAsyncThunk('users/load', async () => fetchUserProfiles())

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadUsers.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

type StateWithUsers = { users: UsersState }

export const selectUsers = (state: StateWithUsers) => state.users.items
export const selectUsersStatus = (state: StateWithUsers) => state.users.status

export const selectPopularUsers = createSelector([selectUsers], (users) =>
  [...users].sort((a, b) => b.likes - a.likes).slice(0, SECTION_LIMIT),
)

export const selectNewUsers = createSelector([selectUsers], (users) =>
  [...users].sort((a, b) => b.date_created.localeCompare(a.date_created)).slice(0, SECTION_LIMIT),
)

export default usersSlice.reducer
