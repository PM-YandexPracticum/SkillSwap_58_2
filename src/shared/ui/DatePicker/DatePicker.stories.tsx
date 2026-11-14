import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePickerComponent } from './DatePicker'

const meta: Meta<typeof DatePickerComponent> = {
  title: 'Components/Inputs/DatePicker',
  component: DatePickerComponent,
  tags: ['autodocs'],
  args: {},
  decorators: [
    (Story) => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        width: '100%'
      }}>
        <div style={{ maxWidth: 208 }}>
          <Story />
        </div>
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
