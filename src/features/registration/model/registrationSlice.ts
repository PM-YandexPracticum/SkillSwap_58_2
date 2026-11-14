import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchUserProfiles } from '@/api/users'
import type { AuthUser, UserProfile } from '@/shared/types'
import { saveAuthUser } from '@/features/auth/model/authUtils'
import { addUser } from '@/entities/user/model/usersSlice'
import {
  getRegisteredUsers,
  saveRegisteredUsers,
  toProfile,
  type RegisteredUser,
} from '@/entities/user/model/registeredUsers'
import { resolveDbAsset } from '@/shared/lib/assets'
import { toIsoDate } from '../lib/dates'
import {
  clearDraft,
  EMPTY_DRAFT,
  getDraft,
  saveDraft,
  type CompletedStep,
  type RegistrationDraft,
  type StoredDraft,
} from './registrationStorage'

export const EMAIL_TAKEN_ERROR = 'Email уже используется'
export const EMAIL_CHECK_ERROR = 'Не удалось проверить email. Попробуйте ещё раз'
export const SAVE_ERROR =
  'Не удалось сохранить профиль. Попробуйте загрузить изображения меньшего размера'

export interface RegistrationState extends StoredDraft {
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

type ThunkState = { registration: RegistrationState }

const GENDER_LABELS: Record<string, string> = { male: 'Мужской', female: 'Женский' }

const toStored = ({ draft, completedStep }: RegistrationState): StoredDraft => ({
  draft,
  completedStep,
})

/** Шаг 1: проверяем, что email свободен, и запоминаем email и пароль */
export const submitStep1 = createAsyncThunk<
  StoredDraft,
  { email: string; password: string },
  { state: ThunkState; rejectValue: string }
>('registration/submitStep1', async ({ email, password }, { getState, rejectWithValue }) => {
  let mockUsers: Array<UserProfile & { login?: string }>
  try {
    mockUsers = (await fetchUserProfiles()) as Array<UserProfile & { login?: string }>
  } catch {
    return rejectWithValue(EMAIL_CHECK_ERROR)
  }

  const normalizedEmail = email.trim().toLowerCase()
  const isTaken = [...mockUsers, ...getRegisteredUsers()].some(
    (user) => user.login?.toLowerCase() === normalizedEmail,
  )
  if (isTaken) return rejectWithValue(EMAIL_TAKEN_ERROR)

  const current = toStored(getState().registration)
  const next: StoredDraft = {
    draft: { ...current.draft, email: email.trim(), password },
    completedStep: Math.max(current.completedStep, 1) as CompletedStep,
  }
  saveDraft(next)
  return next
})

/** Шаги 2 и 3: сохраняем введённое в черновик */
export const saveRegistrationStep = createAsyncThunk<
  StoredDraft,
  { step: 2 | 3; data: Partial<RegistrationDraft> },
  { state: ThunkState }
>('registration/saveStep', async ({ step, data }, { getState }) => {
  const current = toStored(getState().registration)
  const completedStep = (
    step === 2 ? Math.max(current.completedStep, 2) : current.completedStep
  ) as CompletedStep
  const next: StoredDraft = { draft: { ...current.draft, ...data }, completedStep }
  saveDraft(next)
  return next
})

/** «Готово»: сохраняем пользователя, добавляем в каталог и сразу входим */
export const completeRegistration = createAsyncThunk<
  { profile: UserProfile; authUser: AuthUser },
  void,
  { state: ThunkState; rejectValue: string }
>('registration/complete', async (_, { getState, dispatch, rejectWithValue }) => {
  const { draft } = getState().registration

  let mockUsers: UserProfile[] = []
  try {
    mockUsers = await fetchUserProfiles()
  } catch {
    // без моков id посчитаем только по зарегистрированным
  }
  const registered = getRegisteredUsers()
  const id =
    Math.max(0, ...mockUsers.map((user) => user.id), ...registered.map((user) => user.id)) + 1

  const user: RegisteredUser = {
    id,
    name: draft.name,
    avatar: draft.avatar,
    birth_date: toIsoDate(draft.birthDate),
    gender: GENDER_LABELS[draft.gender] ?? '',
    city: draft.city,
    likes: 0,
    date_created: new Date().toISOString().slice(0, 10),
    bio: '',
    can_teach: {
      name: draft.skillName,
      category: draft.skillCategory,
      subcategory: draft.skillSubcategory,
      description: draft.skillDescription,
      images: draft.skillImages,
    },
    want_to_learn: draft.learnSubcategories,
    favorites: [],
    login: draft.email,
    password: draft.password,
  }

  let authUser: AuthUser
  try {
    saveRegisteredUsers([...registered, user])
    authUser = saveAuthUser({
      id: String(id),
      name: user.name,
      email: user.login,
      avatar: resolveDbAsset(user.avatar),
      birthDate: user.birth_date,
      gender: draft.gender === 'male' || draft.gender === 'female' ? draft.gender : 'not_specified',
      city: user.city,
      bio: user.bio,
      favorites: [],
    })
  } catch {
    return rejectWithValue(SAVE_ERROR)
  }

  const profile = toProfile(user)
  dispatch(addUser(profile))
  return { profile, authUser }
})

/** Сбросить регистрацию (после «Готово» или при выходе из регистрации) */
export const resetRegistration = createAsyncThunk('registration/reset', async () => {
  clearDraft()
})

const registrationSlice = createSlice({
  name: 'registration',
  initialState: (): RegistrationState => ({
    ...(getDraft() ?? { draft: EMPTY_DRAFT, completedStep: 0 }),
    status: 'idle',
    error: null,
  }),
  reducers: {
    clearRegistrationError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitStep1.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(submitStep1.fulfilled, (state, action) => {
        state.status = 'idle'
        state.draft = action.payload.draft
        state.completedStep = action.payload.completedStep
      })
      .addCase(submitStep1.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? EMAIL_CHECK_ERROR
      })
      .addCase(saveRegistrationStep.fulfilled, (state, action) => {
        state.draft = action.payload.draft
        state.completedStep = action.payload.completedStep
      })
      .addCase(completeRegistration.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(completeRegistration.fulfilled, (state) => {
        state.status = 'idle'
      })
      .addCase(completeRegistration.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? SAVE_ERROR
      })
      .addCase(resetRegistration.fulfilled, (state) => {
        state.draft = EMPTY_DRAFT
        state.completedStep = 0
        state.status = 'idle'
        state.error = null
      })
  },
})

export const { clearRegistrationError } = registrationSlice.actions

// В тестах со своим стором слайса может не быть — селекторы это переживают
type StateWithRegistration = { registration?: RegistrationState }

export const selectRegistrationDraft = (state: StateWithRegistration) =>
  state.registration?.draft ?? EMPTY_DRAFT
export const selectCompletedStep = (state: StateWithRegistration): CompletedStep =>
  state.registration?.completedStep ?? 0
export const selectRegistrationStatus = (state: StateWithRegistration) =>
  state.registration?.status ?? 'idle'
export const selectRegistrationError = (state: StateWithRegistration) =>
  state.registration?.error ?? null

export default registrationSlice.reducer
