import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePickerComponent } from './DatePicker'

const meta: Meta<typeof DatePickerComponent> = {
  title: 'Component/DatePicker',
  component: DatePickerComponent,
  tags: ['autodocs'],
  args: {},
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 208 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
