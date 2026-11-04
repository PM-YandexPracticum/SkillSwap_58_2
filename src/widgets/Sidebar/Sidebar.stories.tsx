import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { Sidebar } from './Sidebar'
import filterReducer, { selectFilter } from '../../features/catalog-filter/model/filterSlice'
import { useAppSelector } from '../../store/hooks'
import type { SkillCategory, City } from '../../shared/types'

const mockCategories: SkillCategory[] = [
  {
    id: 0,
    category: 'Бизнес и карьера',
    icon: '',
    subcategories: ['Тайм-менеджмент', 'Маркетинг и реклама', 'Личный бренд'],
  },
  {
    id: 1,
    category: 'Творчество и искусство',
    icon: '',
    subcategories: ['Рисование и иллюстрация', 'Фотография'],
  },
  {
    id: 2,
    category: 'Иностранные языки',
    icon: '',
    subcategories: ['Английский', 'Французский', 'Испанский'],
  },
  {
    id: 3,
    category: 'Образование и развитие',
    icon: '',
    subcategories: ['Личностное развитие', 'Навыки обучения'],
  },
  {
    id: 4,
    category: 'Здоровье и лайфстайл',
    icon: '',
    subcategories: ['Йога и медитация', 'Питание и ЗОЖ'],
  },
  { id: 5, category: 'Дом и уют', icon: '', subcategories: ['Уборка и организация', 'Ремонт'] },
]

const mockCities: City[] = [
  { id: '1', name: 'Москва' },
  { id: '2', name: 'Санкт-Петербург' },
  { id: '3', name: 'Новосибирск' },
  { id: '4', name: 'Екатеринбург' },
  { id: '5', name: 'Казань' },
  { id: '6', name: 'Краснодар' },
  { id: '7', name: 'Самара' },
]

const store = configureStore({ reducer: { filter: filterReducer } })

const FilterStateView = () => {
  const { skillType, skills, gender, cities } = useAppSelector(selectFilter)
  return (
    <pre style={{ fontSize: 12 }}>
      {JSON.stringify({ skillType, skills, gender, cities }, null, 2)}
    </pre>
  )
}

const meta: Meta<typeof Sidebar> = {
  title: 'Widgets/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  args: { categories: mockCategories, cities: mockCities },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <div style={{ display: 'flex', gap: 24, padding: 24, backgroundColor: '#F9FAF7' }}>
          <Story />
          <FilterStateView />
        </div>
      </Provider>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Sidebar>

export const Default: Story = {}
