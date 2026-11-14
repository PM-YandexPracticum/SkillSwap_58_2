import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
  args: {
    label: 'Описание',
    placeholder: 'Коротко опишите, чему можете научить',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 436 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Textarea>

export const Default: Story = {}

export const Filled: Story = {
  args: { defaultValue: 'Учу играть на гитаре с нуля: аккорды, бой, первые песни' },
}

export const WithHint: Story = {
  args: { hint: 'Не более 500 символов' },
}

export const WithError: Story = {
  args: { hint: 'Не более 500 символов', error: 'Поле обязательно для заполнения' },
}

export const Disabled: Story = {
  args: { disabled: true },
}
