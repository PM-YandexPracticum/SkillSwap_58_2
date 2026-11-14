import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'
import photo from './avatar-example.svg'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { alt: 'Иван', src: photo },
  argTypes: { size: { control: { type: 'number', min: 24, max: 200 } } },
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
type Story = StoryObj<typeof Avatar>

export const Default: Story = {}

export const Small: Story = { args: { size: 48 } }

export const WithoutPhoto: Story = { args: { src: undefined, alt: 'Анна' } }

export const BrokenImage: Story = {
  args: { src: 'https://invalid.example/none.jpg', alt: 'Максим' },
}
