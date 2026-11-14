import type { Meta, StoryObj } from '@storybook/react-vite'
import { UserInfo } from './UserInfo'
import photo from '../Avatar/avatar-example.svg'

const mockUsers = [
  { name: 'Алексей', city: 'Москва', birth_date: '1988-03-14', likes: 1247 },
  { name: 'Мария', city: 'Краснодар', birth_date: '2005-11-27', likes: 3820 },
  { name: 'Илона', city: 'Екатеринбург', birth_date: '1993-05-02', likes: 12 },
]

const meta: Meta<typeof UserInfo> = {
  title: 'Components/UserInfo',
  component: UserInfo,
  tags: ['autodocs'],
  argTypes: {
    avatar: { control: 'file' },
    name: { control: 'text' },
    city: { control: 'text' },
    birth_date: { control: 'date' },
    likes: { control: 'number' },
  },
  args: {
    avatar: photo,
    name: 'User',
    city: 'Москва',
    birth_date: '2000-01-01',
    likes: 0,
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
        <div style={{ width: 284 }}>
          <Story />
        </div>
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

const RandomUser = () => {
  const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]
  return <UserInfo avatar={photo} {...user} />
}

export const Default: Story = {
  args: {},
}

export const User: Story = {
  render: () => <RandomUser />,
}
