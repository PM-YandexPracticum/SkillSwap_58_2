import type { Meta, StoryObj } from '@storybook/react-vite'
import { LikeComponent } from './Like'

const meta: Meta<typeof LikeComponent> = {
  title: 'Component/Like',
  component: LikeComponent,
  tags: ['autodocs'],
  argTypes: {
    counter: {control: "number"},
    isLiked: {control: "boolean"},
    onChange: { action: "changed" },
  },
  args: {
    counter: 0,
    isLiked: false,
  }
}

export default meta

type Story = StoryObj<typeof LikeComponent>

export const Default: Story = {
  args: {  },
}

export const Liked: Story = {
    args: {counter: 1, isLiked: true},
}

export const ManyLikes: Story = {
    args: {counter: 11900}
}