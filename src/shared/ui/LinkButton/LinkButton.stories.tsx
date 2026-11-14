import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { LinkButton } from './LinkButton'

const meta: Meta<typeof LinkButton> = {
  title: 'Components/Buttons/LinkButton',
  component: LinkButton,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof LinkButton>

export const Default: Story = {
  render: (args) => (
    <div style={{ pointerEvents: 'none' }}>
      <LinkButton {...args} />
    </div>
  ),
  args: {
    isOpen: false,
    children: 'Все категории',
  },
}

export const Opened: Story = {
  render: (args) => (
    <div style={{ pointerEvents: 'none' }}>
      <LinkButton {...args} />
    </div>
  ),
  args: {
    isOpen: true,
    children: 'Скрыть категории',
  },
}

const InteractiveExample = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <LinkButton
      isOpen={isOpen}
      onClick={() => setIsOpen((prev) => !prev)}
    >
      {isOpen ? 'Скрыть категории' : 'Все категории'}
    </LinkButton>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveExample />,
}