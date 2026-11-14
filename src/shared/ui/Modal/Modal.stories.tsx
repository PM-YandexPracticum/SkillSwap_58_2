import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/shared/ui/Button'
import { Modal } from './Modal'

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Modal>

const contentStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
  width: 556,
  maxWidth: '100%',
  padding: '80px 60px',
  textAlign: 'center',
} as const

function ModalExample({ extraText = 0 }: { extraText?: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Открыть окно</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} label="Ваше предложение создано">
        <div style={contentStyle}>
          <h2>Ваше предложение создано</h2>
          <p>Теперь вы можете предложить обмен</p>
          {Array.from({ length: extraText }, (_, index) => (
            <p key={index}>Дополнительный текст {index + 1}, чтобы окно стало выше экрана.</p>
          ))}
          <Button onClick={() => setIsOpen(false)}>Готово</Button>
        </div>
      </Modal>
    </>
  )
}

export const Default: Story = { render: () => <ModalExample /> }

export const LongContent: Story = { render: () => <ModalExample extraText={30} /> }
