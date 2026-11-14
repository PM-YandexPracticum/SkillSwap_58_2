import { describe, it, expect, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import exchangeReducer, {
  clearNotifications,
  proposeExchange,
  readAllNotifications,
  selectHasUnreadNotifications,
} from './exchangeSlice'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

const makeStore = () => configureStore({ reducer: { exchange: exchangeReducer } })
const saved = (key: string) => JSON.parse(localStorage.getItem(key) ?? 'null')

describe('exchangeSlice', () => {
  beforeEach(() => localStorage.clear())

  it('запоминает, кому предложили обмен, и добавляет уведомление', async () => {
    const store = makeStore()

    await store.dispatch(proposeExchange({ userId: 3, userName: 'Иван' }))

    const { proposedTo, notifications } = store.getState().exchange
    expect(proposedTo).toEqual([3])
    expect(notifications[0]).toMatchObject({ text: 'Вы предложили обмен Иван', isRead: false })
    expect(saved(LOCAL_STORAGE_KEYS.REQUESTS)).toEqual([3])
    expect(saved(LOCAL_STORAGE_KEYS.NOTIFICATIONS)).toHaveLength(1)
    expect(selectHasUnreadNotifications(store.getState())).toBe(true)
  })

  it('после перезагрузки берёт состояние из localStorage', async () => {
    await makeStore().dispatch(proposeExchange({ userId: 3, userName: 'Иван' }))

    const reloaded = makeStore()

    expect(reloaded.getState().exchange.proposedTo).toEqual([3])
    expect(reloaded.getState().exchange.notifications).toHaveLength(1)
  })

  it('не дублирует пользователя при повторном предложении', async () => {
    const store = makeStore()

    await store.dispatch(proposeExchange({ userId: 3, userName: 'Иван' }))
    await store.dispatch(proposeExchange({ userId: 3, userName: 'Иван' }))

    expect(store.getState().exchange.proposedTo).toEqual([3])
  })

  it('«Прочитать все» снимает красную точку', async () => {
    const store = makeStore()
    await store.dispatch(proposeExchange({ userId: 3, userName: 'Иван' }))

    await store.dispatch(readAllNotifications())

    expect(selectHasUnreadNotifications(store.getState())).toBe(false)
    expect(saved(LOCAL_STORAGE_KEYS.NOTIFICATIONS)[0].isRead).toBe(true)
  })

  it('«Очистить» удаляет только просмотренные', async () => {
    const store = makeStore()
    await store.dispatch(proposeExchange({ userId: 3, userName: 'Иван' }))
    await store.dispatch(readAllNotifications())
    await store.dispatch(proposeExchange({ userId: 4, userName: 'Анна' }))

    await store.dispatch(clearNotifications())

    const { notifications } = store.getState().exchange
    expect(notifications).toHaveLength(1)
    expect(notifications[0].text).toBe('Вы предложили обмен Анна')
    expect(saved(LOCAL_STORAGE_KEYS.NOTIFICATIONS)).toHaveLength(1)
  })
})
