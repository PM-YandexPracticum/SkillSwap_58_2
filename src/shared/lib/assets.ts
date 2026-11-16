/** Путь картинки из public/db превращает в URL, data:-ссылки и абсолютные пути оставляет как есть */
export function resolveDbAsset(path: string): string {
  if (!path) return ''
  if (/^(data:|blob:|https?:|\/)/.test(path)) return path
  return `/db/${path}`
}
