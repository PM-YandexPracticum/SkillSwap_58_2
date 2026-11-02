import type { Meta, StoryObj } from '@storybook/react-vite'
import { Header } from './Header'

const meta: Meta<typeof Header> = {
  title: 'Widgets/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  args: {
    onSearch: (query) => console.log('Поиск:', query),
    onLoginClick: () => console.log('Войти'),
    onRegisterClick: () => console.log('Зарегистрироваться'),
    onThemeToggle: () => console.log('Смена темы'),
  },
}

export default meta
type Story = StoryObj<typeof Header>

export const Default: Story = {}
