export const ROUTES = {
  HOME: '/',
  SKILL: '/skill/:id',
  PROFILE: '/profile',
  FAVORITES: '/favorites',
  CREATE: '/create',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_STEP_1: '/register/step1',
  REGISTER_STEP_2: '/register/step2',
  REGISTER_STEP_3: '/register/step3',
  SKILLS: '/skills',
  SERVER_ERROR: '/500',
  ABOUT: '/about',
} as const

export const SKILL_CATEGORIES = [
  'Программирование',
  'Дизайн',
  'Языки',
  'Музыка',
  'Спорт',
  'Кулинария',
  'Фото и видео',
  'Бизнес',
  'Другое',
] as const

export const LOCAL_STORAGE_KEYS = {
  AUTH_USER: 'skillswap_auth_user',
  FAVORITES: 'skillswap_favorites',
  REQUESTS: 'skillswap_requests',
  NOTIFICATIONS: 'skillswap_notifications',
  THEME: 'skillswap_theme',
} as const
