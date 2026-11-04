import type { Meta, StoryObj } from '@storybook/react-vite'
import { TabStepper } from './TabStepper'

const meta: Meta<typeof TabStepper> = {
  title: 'Shared/TabStepper',
  component: TabStepper,
  args: { total: 3, current: 1 },
  argTypes: {
    total: { control: { type: 'number', min: 1, max: 10 } },
    current: { control: { type: 'number', min: 1, max: 10 } },
  },
}

export default meta
type Story = StoryObj<typeof TabStepper>

export const Step1: Story = { args: { current: 1 } }

export const Step2: Story = { args: { current: 2 } }

export const Step3: Story = { args: { current: 3 } }

export const FiveSteps: Story = { args: { total: 5, current: 3 } }
