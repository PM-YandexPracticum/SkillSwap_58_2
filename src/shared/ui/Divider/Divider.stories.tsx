import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from './Divider'

const meta: Meta<typeof Divider> = {
  title: 'Shared/Divider',
  component: Divider,
}

export default meta
type Story = StoryObj<typeof Divider>

export const Default: Story = {}

export const InsideBlock: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <Divider />
    </div>
  ),
}
