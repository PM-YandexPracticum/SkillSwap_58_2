import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchUserProfiles } from '../../../api/users'
import type { AuthUser, UserProfile } from '../../../shared/types'
import { getRegisteredUsers } from '../../../entities/user/model/registeredUsers'
import { resolveDbAsset } from '../../../shared/lib/assets'
import { completeRegistration } from '../../registration/model/registrationSlice'
import { clearAuthUser, getAuthUser, persistAuthUser, saveAuthUser } from './authUtils'

export const LOGIN_ERROR =
  'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных'

export const FAVORITE_AUTH_ERROR = 'Чтобы добавить в избранное, нужно войти'

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

type StateWithAuth = { auth: AuthState }

export type AuthUserUpdate = Partial<
  Pick<AuthUser, 'name' | 'email' | 'avatar' | 'birthDate' | 'gender' | 'city' | 'bio'>
>

type UserWithCredentials = UserProfile & { login: string; password: string }

const normalizeGender = (gender: string): NonNullable<AuthUser['gender']> => {
  if (gender === 'Мужской' || gender === 'male') return 'male'
  if (gender === 'Женский' || gender === 'female') return 'female'
  return 'not_specified'
}

export const login = createAsyncThunk<AuthUser, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    // моки из users.json + пользователи, зарегистрированные в приложении
    let mockUsers: UserWithCredentials[]
    try {
      mockUsers = (await fetchUserProfiles()) as UserWithCredentials[]
    } catch {
      return rejectWithValue('Не удалось загрузить данные для входа. Попробуйте ещё раз')
    }
    const users = [...mockUsers, ...getRegisteredUsers()]
    const normalizedEmail = email.trim().toLowerCase()
    const found = users.find(
      (user) => user.login.toLowerCase() === normalizedEmail && user.password === password,
    )

    if (!found) return rejectWithValue(LOGIN_ERROR)

    return saveAuthUser({
      id: String(found.id),
      name: found.name,
      email: found.login,
      avatar: resolveDbAsset(found.avatar),
      birthDate: found.birth_date,
      gender: normalizeGender(found.gender),
      city: found.city,
      bio: found.bio,
      favorites: found.favorites ?? [],
    })
  },
)

export const updateAuthUser = createAsyncThunk<
  AuthUser,
  AuthUserUpdate,
  { rejectValue: string }
>('auth/updateUser', async (updates, { getState, rejectWithValue }) => {
  const currentUser = (getState() as { auth: AuthState }).auth.user
  if (!currentUser) return rejectWithValue('Пользователь не авторизован')

  return persistAuthUser({ ...currentUser, ...updates })
})

export const logout = createAsyncThunk('auth/logout', async () => {
  clearAuthUser()
})

/** Добавляет пользователя в избранное или убирает, если он уже там. Сохраняет в localStorage */
export const toggleFavorite = createAsyncThunk<
  number[],
  number,
  { state: StateWithAuth; rejectValue: string }
>('auth/toggleFavorite', async (userId, { getState, rejectWithValue }) => {
  const user = getState().auth.user
  if (!user) return rejectWithValue(FAVORITE_AUTH_ERROR)

  const current = user.favorites ?? []
  const favorites = current.includes(userId)
    ? current.filter((id) => id !== userId)
    : [...current, userId]

  saveAuthUser({ ...user, favorites })
  return favorites
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
      .addCase(updateAuthUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateAuthUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(updateAuthUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Не удалось сохранить профиль'
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.status = 'idle'
        state.error = null
      })
      // после «Готово» в регистрации пользователь сразу входит
      .addCase(completeRegistration.fulfilled, (state, action) => {
        state.user = action.payload.authUser
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (state.user) state.user.favorites = action.payload
      })
  },
})

export const { clearAuthError } = authSlice.actions

const EMPTY_FAVORITES: number[] = []

export const selectAuthUser = (state: StateWithAuth) => state.auth.user
export const selectIsAuth = (state: StateWithAuth) => state.auth.user !== null
export const selectAuthStatus = (state: StateWithAuth) => state.auth.status
export const selectAuthError = (state: StateWithAuth) => state.auth.error
export const selectFavoriteIds = (state: StateWithAuth) =>
  state.auth.user?.favorites ?? EMPTY_FAVORITES

export default authSlice.reducer