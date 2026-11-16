import { describe, it, expect, beforeEach, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import registrationReducer, {
  completeRegistration,
  EMAIL_TAKEN_ERROR,
  resetRegistration,
  saveRegistrationStep,
  submitStep1,
} from './registrationSlice'
import { EMPTY_DRAFT } from './registrationStorage'
import {
  getRegisteredUsers,
  saveRegisteredUsers,
  type RegisteredUser,
} from '@/entities/user/model/registeredUsers'
import usersReducer, { initialState as usersInitialState } from '@/entities/user/model/usersSlice'
import authReducer, { login } from '@/features/auth/model/authSlice'
import { LOCAL_STORAGE_KEYS, SESSION_STORAGE_KEYS } from '@/shared/lib/constants'
import { toIsoDate } from '../lib/dates'

vi.mock('@/api/users', () => ({
  fetchUserProfiles: vi.fn(async () => [{ id: 30, login: 'alexey.1988@example.com' }]),
}))

const makeStore = () => configureStore({ reducer: { registration: registrationReducer } })
const savedDraft = () =>
  JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEYS.REGISTRATION_DRAFT) ?? 'null')

const fullDraft = {
  ...EMPTY_DRAFT,
  email: 'new@example.com',
  password: '12345678',
  name: 'Мирас',
  birthDate: '15.02.2000',
  gender: 'male',
  city: 'Москва',
  learnCategories: ['Иностранные языки'],
  learnSubcategories: ['Английский'],
  skillName: 'Гитара',
  skillCategory: 'Творчество и искусство',
  skillSubcategory: 'Музыка и звук',
  skillDescription: 'Научу играть',
  skillImages: ['data:image/png;base64,AAA'],
}

const makeFullStore = () =>
  configureStore({
    reducer: { registration: registrationReducer, users: usersReducer, auth: authReducer },
    preloadedState: {
      registration: {
        draft: fullDraft,
        completedStep: 2 as const,
        status: 'idle' as const,
        error: null,
      },
      users: { ...usersInitialState, status: 'succeeded' as const },
    },
  })

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

  it('«Готово» сохраняет пользователя в формате users.json, входит и добавляет в каталог', async () => {
    const store = makeFullStore()

    await store.dispatch(completeRegistration())

    const [saved] = getRegisteredUsers()
    expect(saved).toMatchObject({
      id: 31,
      name: 'Мирас',
      birth_date: '2000-02-15',
      gender: 'Мужской',
      login: 'new@example.com',
      want_to_learn: ['Английский'],
      can_teach: { name: 'Гитара', subcategory: 'Музыка и звук' },
    })
    expect(store.getState().auth.user?.name).toBe('Мирас')
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)).toContain('new@example.com')
    expect(store.getState().users.items.map((user) => user.id)).toContain(31)
  })

  it('под зарегистрированным пользователем можно войти', async () => {
    await makeFullStore().dispatch(completeRegistration())
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER)
    const store = configureStore({ reducer: { auth: authReducer } })

    await store.dispatch(login({ email: 'new@example.com', password: '12345678' }))

    expect(store.getState().auth.user?.name).toBe('Мирас')
  })

  it('переводит дату из дд.мм.гггг в гггг-мм-дд', () => {
    expect(toIsoDate('15.02.2000')).toBe('2000-02-15')
    expect(toIsoDate('2000-02-15')).toBe('2000-02-15')
  })
})
