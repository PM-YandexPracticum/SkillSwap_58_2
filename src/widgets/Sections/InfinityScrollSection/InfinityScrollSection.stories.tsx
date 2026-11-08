import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { InfinityScrollSection } from './InfinityScrollSection'

const TOTAL = 24
const STEP = 6

const DemoSection = () => {
  const [count, setCount] = useState(STEP)

  return (
    <InfinityScrollSection
      title="Рекомендуем"
      hasMore={count < TOTAL}
      onLoadMore={() => setCount((prev) => Math.min(prev + STEP, TOTAL))}
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{ blockSize: 300, borderRadius: 12, backgroundColor: '#fff', padding: 20 }}
        >
          Карточка {i + 1}
        </div>
      ))}
    </InfinityScrollSection>
  )
}

const meta: Meta<typeof InfinityScrollSection> = {
  title: 'Widgets/InfinityScrollSection',
  component: InfinityScrollSection,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof InfinityScrollSection>

export const Default: Story = {
  render: () => (
    <div style={{ padding: 24, backgroundColor: '#F9FAF7' }}>
      <DemoSection />
    </div>
  ),
}
