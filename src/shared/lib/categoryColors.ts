export const DEFAULT_TAG_COLOR = '#E7F2F6'

export const CATEGORY_COLORS: Record<string, string> = {
  'Бизнес и карьера': '#EEE7F7',
  'Иностранные языки': '#EBE5C5',
  'Здоровье и лайфстайл': '#E9F7E7',
  'Творчество и искусство': '#F7E7F2',
  'Дом и уют': '#F7EBE5',
  'Образование и развитие': '#E7F2F6',
}

export const getCategoryColor = (category?: string): string =>
  (category && CATEGORY_COLORS[category]) || DEFAULT_TAG_COLOR
