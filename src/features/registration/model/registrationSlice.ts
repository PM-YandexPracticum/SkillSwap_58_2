import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchUserProfiles } from '@/api/users'
import type { UserProfile } from '@/shared/types'
import {
  clearDraft,
  EMPTY_DRAFT,
  getDraft,
  getRegisteredUsers,
  saveDraft,
  type CompletedStep,
  type RegistrationDraft,
  type StoredDraft,
} from './registrationStorage'

export const EMAIL_TAKEN_ERROR = 'Email уже используется'
export const EMAIL_CHECK_ERROR = 'Не удалось проверить email. Попробуйте ещё раз'

export interface RegistrationState extends StoredDraft {
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

type ThunkState = { registration: RegistrationState }

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
