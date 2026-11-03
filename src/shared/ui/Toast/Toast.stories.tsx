import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Toast } from './Toast'

const meta: Meta<typeof Toast> = {
  title: 'Shared/Toast',
  component: Toast,
  args: { children: 'Вы предложили обмен', duration: 5000 },
  argTypes: {
    duration: { control: 'number' },
    actionLabel: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Toast>

function Demo(args: React.ComponentProps<typeof Toast>) {
  const [open, setOpen] = useState(true)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Показать тост</Button>
      {open && <Toast {...args} onClose={() => setOpen(false)} />}
    </>
  )
}

export const Default: Story = { render: (args) => <Demo {...args} /> }

export const WithAction: Story = {
  args: { children: 'Вам предложили обмен', actionLabel: 'Перейти' },
  render: (args) => <Demo {...args} />,
}

export const NoAutoClose: Story = {
  args: { duration: 0 },
  render: (args) => <Demo {...args} />,
}
