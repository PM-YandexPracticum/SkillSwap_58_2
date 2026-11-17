export async function fetchMockData<T>(file: string, errorMessage: string): Promise<T> {
  try {
    const response = await fetch(`/db/${file}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return (await response.json()) as T
  } catch {
    throw new Error(errorMessage)
  }
}
