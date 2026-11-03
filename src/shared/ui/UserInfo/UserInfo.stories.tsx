import type { Meta, StoryObj } from '@storybook/react-vite'
import { UserInfo } from './UserInfo'
import users from '../../../../public/db/users.json'
import photo from '../Avatar/avatar-example.svg'

const meta: Meta<typeof UserInfo> = {
  title: 'Component/UserInfo',
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
}

export default meta

type Story = StoryObj<typeof meta>

const RandomUser = () => {
  const pathStart = '../../../../public/db/'
  const data = users
  const randomIndex = Math.floor(Math.random() * data.length)
  const user = data[randomIndex]
  return (
    <UserInfo
      avatar={`${pathStart}${user['avatar']}`}
      name={user['name']}
      city={user['city']}
      birth_date={user['birth_date']}
      likes={user['likes']}
    />
  )
}

export const Default: Story = {
  args: {}
}

export const User: Story = {
  render: () => <RandomUser />,
}
