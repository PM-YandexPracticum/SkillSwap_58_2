import type { Meta, StoryObj } from '@storybook/react-vite'
import { Loader } from './Loader'

const meta: Meta<typeof Loader> = {
  title: 'Components/Loader',
  component: Loader,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Loader>

export const Default: Story = {}

export const Small: Story = {
  args: { size: 40 },
}
