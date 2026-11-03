import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { MultiSelect } from './MultiSelect'
import type { Option } from './types'

const mockOptions: Option[] = [
  { id: 'business', label: 'Бизнес и карьера' },
  { id: 'creativity', label: 'Творчество и искусство' },
  { id: 'languages', label: 'Иностранные языки' },
  { id: 'education', label: 'Образование и развитие' },
  { id: 'health', label: 'Здоровье и лайфстайл' },
  { id: 'home', label: 'Дом и уют' },
]

const meta: Meta<typeof MultiSelect> = {
  title: 'Shared/MultiSelect',
  component: MultiSelect,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof MultiSelect>

const InteractiveExample = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  return (
    <MultiSelect
      options={mockOptions}
      selectedIds={selectedIds}
      onChange={setSelectedIds}
      label="Категория навыка, которому хотите научиться"
      placeholder="Выберите категорию"
    />
  )
}

export const Interactive: Story = {
  render: () => <InteractiveExample />,
}