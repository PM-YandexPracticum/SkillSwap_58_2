import type { User, UserProfile } from '@/shared/types'

import { fetchMockData } from './fetchMockData'

export async function fetchUsers(): Promise<User[]> {
  return fetchMockData<User[]>('users.json', 'Не удалось загрузить пользователей')
}

export async function fetchUserById(id: string): Promise<User | undefined> {
  const users = await fetchUsers()
  return users.find((user) => user.id === id)
}

export async function fetchUserProfiles(): Promise<UserProfile[]> {
  return fetchMockData<UserProfile[]>('users.json', 'Не удалось загрузить пользователей')
}