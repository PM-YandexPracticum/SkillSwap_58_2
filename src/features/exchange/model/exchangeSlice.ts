import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getNotifications,
  getProposedTo,
  saveNotifications,
  saveProposedTo,
  type ExchangeNotification,
} from './exchangeStorage'

export type { ExchangeNotification }

export interface ExchangeState {
  proposedTo: number[]
  notifications: ExchangeNotification[]
}

type ThunkState = { exchange: ExchangeState }

export interface ProposeExchangePayload {
  userId: number
  userName: string
}

/** Предложить обмен: запоминаем пользователя и добавляем уведомление себе */
export const proposeExchange = createAsyncThunk<
  { proposedTo: number[]; notification: ExchangeNotification },
  ProposeExchangePayload,
  { state: ThunkState }
>('exchange/propose', async ({ userId, userName }, { getState }) => {
  const { proposedTo, notifications } = getState().exchange
  const nextProposedTo = proposedTo.includes(userId) ? proposedTo : [...proposedTo, userId]
  const notification: ExchangeNotification = {
    id: `${Date.now()}-${userId}`,
    text: `Вы предложили обмен ${userName}`,
    description: 'Теперь дождитесь подтверждения',
    createdAt: new Date().toISOString(),
    isRead: false,
  }

  saveProposedTo(nextProposedTo)
  saveNotifications([notification, ...notifications])
  return { proposedTo: nextProposedTo, notification }
})

/** «Прочитать все» — новые уведомления переходят в просмотренные */
export const readAllNotifications = createAsyncThunk<
  ExchangeNotification[],
  void,
  { state: ThunkState }
>('exchange/readAll', async (_, { getState }) => {
  const notifications = getState().exchange.notifications.map((item) => ({
    ...item,
    isRead: true,
  }))
  saveNotifications(notifications)
  return notifications
})

/** «Очистить» — удаляет просмотренные, новые остаются */
export const clearNotifications = createAsyncThunk<
  ExchangeNotification[],
  void,
  { state: ThunkState }
>('exchange/clear', async (_, { getState }) => {
  const notifications = getState().exchange.notifications.filter((item) => !item.isRead)
  saveNotifications(notifications)
  return notifications
})

const exchangeSlice = createSlice({
  name: 'exchange',
  initialState: (): ExchangeState => ({
    proposedTo: getProposedTo(),
    notifications: getNotifications(),
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(proposeExchange.fulfilled, (state, action) => {
        state.proposedTo = action.payload.proposedTo
        state.notifications.unshift(action.payload.notification)
      })
      .addCase(readAllNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload
      })
      .addCase(clearNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload
      })
  },
})

// В тестах со своим стором слайса может не быть — селекторы это переживают
type StateWithExchange = { exchange?: ExchangeState }

const EMPTY_IDS: number[] = []
const EMPTY_NOTIFICATIONS: ExchangeNotification[] = []

export const selectProposedTo = (state: StateWithExchange) =>
  state.exchange?.proposedTo ?? EMPTY_IDS
export const selectNotifications = (state: StateWithExchange) =>
  state.exchange?.notifications ?? EMPTY_NOTIFICATIONS
export const selectHasUnreadNotifications = (state: StateWithExchange) =>
  selectNotifications(state).some((item) => !item.isRead)

export default exchangeSlice.reducer
