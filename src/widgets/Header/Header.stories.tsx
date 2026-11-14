import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import skillCategoriesReducer from '@/entities/skills/model/skillCategoriesSlice'
import { Header } from './Header'

const store = configureStore({
  reducer: {
    skillCategories: skillCategoriesReducer,
  },
})

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
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Provider store={store}>
          <Story />
        </Provider>
      </MemoryRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Header>

export const Default: Story = {}