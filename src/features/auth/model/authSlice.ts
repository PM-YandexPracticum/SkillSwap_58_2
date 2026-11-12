import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchUserProfiles } from '../../../api/users'
import type { AuthUser, UserProfile } from '../../../shared/types'
import { clearAuthUser, getAuthUser, saveAuthUser } from './authUtils'

export const LOGIN_ERROR =
  'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных'

export type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface AuthState {
  user: AuthUser | null
  status: AuthStatus
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

type UserWithCredentials = UserProfile & { login: string; password: string }

export const login = createAsyncThunk<AuthUser, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    const users = (await fetchUserProfiles()) as UserWithCredentials[]
    const normalizedEmail = email.trim().toLowerCase()
    const found = users.find(
      (user) => user.login.toLowerCase() === normalizedEmail && user.password === password,
    )

    if (!found) return rejectWithValue(LOGIN_ERROR)

    return saveAuthUser({
      id: String(found.id),
      name: found.name,
      email: found.login,
      avatar: `/db/${found.avatar}`,
      favorites: found.favorites ?? [],
    })
  },
)

export const logout = createAsyncThunk('auth/logout', async () => {
  clearAuthUser()
})

const authSlice = createSlice({
  name: 'auth',
  initialState: (): AuthState => ({ user: getAuthUser(), status: 'idle', error: null }),
  reducers: {
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? LOGIN_ERROR
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.status = 'idle'
        state.error = null
      })
  },
})

export const { clearAuthError } = authSlice.actions

type StateWithAuth = { auth: AuthState }

export const selectAuthUser = (state: StateWithAuth) => state.auth.user
export const selectIsAuth = (state: StateWithAuth) => state.auth.user !== null
export const selectAuthStatus = (state: StateWithAuth) => state.auth.status
export const selectAuthError = (state: StateWithAuth) => state.auth.error

export default authSlice.reducer
