export const MAX_IMAGES = 10
export const MAX_IMAGE_SIZE_MB = 1
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

/** Проверка файла по совету наставника: количество, формат, вес */
export function validateImage(file: File, currentCount: number): string | null {
  if (currentCount >= MAX_IMAGES) return `Можно загрузить не больше ${MAX_IMAGES} изображений`
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'Подходят только JPG, PNG или WebP'
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `Размер изображения — не больше ${MAX_IMAGE_SIZE_MB} МБ`
  }
  return null
}

/** Читает файл как data URL, чтобы сохранить его в localStorage */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
