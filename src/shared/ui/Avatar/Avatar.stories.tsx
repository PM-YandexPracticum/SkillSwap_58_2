import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

const photo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
      '<rect width="200" height="200" fill="#abd27a"/>' +
      '<circle cx="100" cy="78" r="36" fill="#fff"/>' +
      '<rect x="40" y="130" width="120" height="90" rx="45" fill="#fff"/></svg>',
  )

const meta: Meta<typeof Avatar> = {
  title: 'Shared/Avatar',
  component: Avatar,
  args: { alt: 'Иван', src: photo },
  argTypes: { size: { control: { type: 'number', min: 24, max: 200 } } },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {}

export const Small: Story = { args: { size: 48 } }

export const WithoutPhoto: Story = { args: { src: undefined, alt: 'Анна' } }

export const BrokenImage: Story = {
  args: { src: 'https://invalid.example/none.jpg', alt: 'Максим' },
}
