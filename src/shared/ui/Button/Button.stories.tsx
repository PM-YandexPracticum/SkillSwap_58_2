import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Buttons/Button',
  component: Button,
  args: { children: 'Зарегистрироваться' },
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary'] },
    disabled: { control: 'boolean' },
  },
   decorators: [
    (Story) => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        width: '100%'
      }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { variant: 'primary' } }

export const Secondary: Story = { args: { variant: 'secondary', children: 'Войти' } }

export const Disabled: Story = { args: { disabled: true } }

export const HeaderExample: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="secondary">Войти</Button>
      <Button>Зарегистрироваться</Button>
    </div>
  ),
}
