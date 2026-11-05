import type { Meta, StoryObj } from '@storybook/react-vite'
import { AuthButton } from './AuthButton'

const meta: Meta<typeof AuthButton> = {
  title: 'Shared/AuthButton',
  component: AuthButton,
  args: { provider: 'google', children: 'Продолжить с Google' },
  argTypes: {
    provider: { control: 'radio', options: ['google', 'apple'] },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 436 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AuthButton>

export const Google: Story = {}

export const Apple: Story = { args: { provider: 'apple', children: 'Продолжить с Apple' } }

export const Disabled: Story = { args: { disabled: true } }

export const InForm: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <AuthButton provider="google">Продолжить с Google</AuthButton>
      <AuthButton provider="apple">Продолжить с Apple</AuthButton>
    </div>
  ),
}
