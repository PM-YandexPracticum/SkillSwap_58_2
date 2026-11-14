import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { CheckboxTree } from './CheckboxTree'
import type { TreeItem } from './types'

const mockData: TreeItem[] = [
  {
    id: 'business',
    label: 'Бизнес и карьера',
    children: [
      { id: 'team-management', label: 'Управление командой' },
      { id: 'marketing', label: 'Маркетинг и реклама' },
      { id: 'sales', label: 'Продажи и переговоры' },
      { id: 'personal-brand', label: 'Личный бренд' },
      { id: 'resume', label: 'Резюме и собеседование' },
      { id: 'time-management', label: 'Тайм-менеджмент' },
      { id: 'project-management', label: 'Проектное управление' },
      { id: 'entrepreneurship', label: 'Предпринимательство' },
    ],
  },
  {
    id: 'creativity',
    label: 'Творчество и искусство',
    children: [
      { id: 'drawing', label: 'Рисование и иллюстрация' },
      { id: 'photo', label: 'Фотография' },
      { id: 'video', label: 'Видеомонтаж' },
      { id: 'music', label: 'Музыка и звук' },
      { id: 'acting', label: 'Актёрское мастерство' },
      { id: 'creative-writing', label: 'Креативное письмо' },
      { id: 'art-therapy', label: 'Арт-терапия' },
      { id: 'decor', label: 'Декор и DIY' },
    ],
  },
  {
    id: 'languages',
    label: 'Иностранные языки',
    children: [
      { id: 'english', label: 'Английский' },
      { id: 'french', label: 'Французский' },
      { id: 'spanish', label: 'Испанский' },
      { id: 'german', label: 'Немецкий' },
      { id: 'chinese', label: 'Китайский' },
      { id: 'japanese', label: 'Японский' },
      { id: 'ielts', label: 'Подготовка к экзаменам (IELTS, TOEFL)' },
    ],
  },
  {
    id: 'education',
    label: 'Образование и развитие',
    children: [
      { id: 'personal-development', label: 'Личностное развитие' },
      { id: 'learning-skills', label: 'Навыки обучения' },
      { id: 'cognitive', label: 'Когнитивные техники' },
      { id: 'speed-reading', label: 'Скорочтение' },
      { id: 'teaching', label: 'Навыки преподавания' },
      { id: 'coaching', label: 'Коучинг' },
    ],
  },
  {
    id: 'health',
    label: 'Здоровье и лайфстайл',
    children: [
      { id: 'yoga', label: 'Йога и медитация' },
      { id: 'nutrition', label: 'Питание и ЗОЖ' },
      { id: 'mental-health', label: 'Ментальное здоровье' },
      { id: 'mindfulness', label: 'Осознанность' },
      { id: 'fitness', label: 'Физические тренировки' },
      { id: 'sleep', label: 'Сон и восстановление' },
      { id: 'work-life-balance', label: 'Баланс жизни и работы' },
    ],
  },
  {
    id: 'home',
    label: 'Дом и уют',
    children: [
      { id: 'cleaning', label: 'Уборка и организация' },
      { id: 'home-finance', label: 'Домашние финансы' },
      { id: 'cooking', label: 'Приготовление еды' },
      { id: 'plants', label: 'Домашние растения' },
      { id: 'renovation', label: 'Ремонт' },
      { id: 'storage', label: 'Хранение вещей' },
    ],
  },
]

const meta: Meta<typeof CheckboxTree> = {
  title: 'Components/Forms/CheckboxTree',
  component: CheckboxTree,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof CheckboxTree>

const InteractiveExample = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  return (
    <CheckboxTree
      title="Навыки"
      items={mockData}
      selectedIds={selectedIds}
      onChange={setSelectedIds}
    />
  )
}

export const Interactive: Story = {
  render: () => <InteractiveExample />,
}