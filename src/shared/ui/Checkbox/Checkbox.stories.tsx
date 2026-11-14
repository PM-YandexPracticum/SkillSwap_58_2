import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Checkbox } from './Checkbox'
import styles from './Checkbox.module.css'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onChange: { action: 'changed' },
  },
  args: {
    label: 'Текст чекбокса',
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Unchecked: Story = {
  args: {
    checked: false,
    indeterminate: false,
    className: styles.noPointerEvents,
  },
}

export const Checked: Story = {
  args: {
    checked: true,
    indeterminate: false,
    className: styles.noPointerEvents,
  },
}

export const Indeterminate: Story = {
  args: {
    checked: false,
    indeterminate: true,
    className: styles.noPointerEvents,
  },
}

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    label: 'Отключенный чекбокс',
  },
}

const FilterGroupExample = () => {
  const [selected, setSelected] = useState<string[]>(['music'])

  const items = [
    { id: 'drawing', label: 'Рисование и иллюстрация' },
    { id: 'photo', label: 'Фотография' },
    { id: 'video', label: 'Видеомонтаж' },
    { id: 'music', label: 'Музыка и звук' },
  ]

  const isAllSelected = selected.length === items.length
  const isIndeterminate = selected.length > 0 && selected.length < items.length

  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(items.map((item) => item.id))
    } else {
      setSelected([])
    }
  }

  const handleChildChange = (id: string, isChecked: boolean) => {
    if (isChecked) {
      setSelected((prev) => [...prev, id])
    } else {
      setSelected((prev) => prev.filter((item) => item !== id))
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Checkbox
        label="Творчество и искусство"
        checked={isAllSelected}
        indeterminate={isIndeterminate}
        onChange={handleParentChange}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginLeft: '32px' }}>
        {items.map((item) => (
          <Checkbox
            key={item.id}
            label={item.label}
            checked={selected.includes(item.id)}
            onChange={(e) => handleChildChange(item.id, e.target.checked)}
          />
        ))}
      </div>
    </div>
  )
}

export const FilterGroup: Story = {
  render: () => <FilterGroupExample />,
}