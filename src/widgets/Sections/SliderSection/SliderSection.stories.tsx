import type { Meta, StoryObj } from '@storybook/react-vite'
import { SliderSection } from './SliderSection'

const meta: Meta<typeof SliderSection> = {
  title: 'Widgets/SliderSection',
  component: SliderSection,
  args: { title: 'Похожие предложения' },
}

export default meta
type Story = StoryObj<typeof SliderSection>

const Placeholder = ({ n }: { n: number }) => (
  <div style={{ height: 240, background: '#fff', borderRadius: 12, padding: 16 }}>Карточка {n}</div>
)

const cards = (count: number) =>
  Array.from({ length: count }, (_, i) => <Placeholder key={i} n={i + 1} />)

export const Default: Story = {
  render: (args) => <SliderSection {...args}>{cards(8)}</SliderSection>,
}

export const FewItems: Story = {
  render: (args) => <SliderSection {...args}>{cards(4)}</SliderSection>,
}
