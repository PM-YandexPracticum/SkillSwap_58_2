import type { City } from '@/shared/types'

import { fetchMockData } from './fetchMockData'

export async function fetchCities(): Promise<City[]> {
  const data = await fetchMockData<{ cities: City[] }>('cities.json', 'Не удалось загрузить города')
  return data.cities
}
