import { describe, it, expect, beforeEach, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import registrationReducer, {
  EMAIL_TAKEN_ERROR,
  resetRegistration,
  saveRegistrationStep,
  submitStep1,
} from './registrationSlice'
import { saveRegisteredUsers, type RegisteredUser } from './registrationStorage'
import { SESSION_STORAGE_KEYS } from '@/shared/lib/constants'

vi.mock('@/api/users', () => ({
  fetchUserProfiles: vi.fn(async () => [{ id: 0, login: 'alexey.1988@example.com' }]),
}))

const makeStore = () => configureStore({ reducer: { registration: registrationReducer } })
const savedDraft = () =>
  JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEYS.REGISTRATION_DRAFT) ?? 'null')

describe('registrationSlice', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('шаг 1: не пускает дальше, если email уже есть в моках', async () => {
    const store = makeStore()

    await store.dispatch(submitStep1({ email: 'Alexey.1988@example.com', password: '12345678' }))

    expect(store.getState().registration.error).toBe(EMAIL_TAKEN_ERROR)
    expect(store.getState().registration.completedStep).toBe(0)
  })

  it('шаг 1: не пускает дальше, если email уже зарегистрирован', async () => {
    saveRegisteredUsers([{ id: 100, login: 'new@example.com' } as RegisteredUser])
    const store = makeStore()

    await store.dispatch(submitStep1({ email: 'new@example.com', password: '12345678' }))

    expect(store.getState().registration.error).toBe(EMAIL_TAKEN_ERROR)
  })

  it('шаг 1: свободный email запоминается в черновике и в sessionStorage', async () => {
    const store = makeStore()

    await store.dispatch(submitStep1({ email: ' free@example.com ', password: '12345678' }))

    const { draft, completedStep, error } = store.getState().registration
    expect(error).toBeNull()
    expect(completedStep).toBe(1)
    expect(draft.email).toBe('free@example.com')
    expect(savedDraft().draft.email).toBe('free@example.com')
  })

  it('черновик переживает перезагрузку страницы', async () => {
    await makeStore().dispatch(submitStep1({ email: 'free@example.com', password: '12345678' }))

    const reloaded = makeStore()

    expect(reloaded.getState().registration.completedStep).toBe(1)
    expect(reloaded.getState().registration.draft.email).toBe('free@example.com')
  })

  it('шаг 2 сохраняет данные и открывает шаг 3', async () => {
    const store = makeStore()
    await store.dispatch(submitStep1({ email: 'free@example.com', password: '12345678' }))

    await store.dispatch(saveRegistrationStep({ step: 2, data: { name: 'Мирас' } }))

    expect(store.getState().registration.completedStep).toBe(2)
    expect(store.getState().registration.draft.name).toBe('Мирас')
  })

  it('сброс очищает черновик', async () => {
    const store = makeStore()
    await store.dispatch(submitStep1({ email: 'free@example.com', password: '12345678' }))

    await store.dispatch(resetRegistration())

    expect(store.getState().registration.completedStep).toBe(0)
    expect(savedDraft()).toBeNull()
  })
})
