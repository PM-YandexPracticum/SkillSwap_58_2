import type { Meta, StoryObj } from '@storybook/react-vite'
import { StandardSection } from './StandardSection'

const meta: Meta<typeof StandardSection> = {
  title: 'Widgets/StandardSection',
  component: StandardSection,
  args: { title: 'Популярное' },
}

export default meta
type Story = StoryObj<typeof StandardSection>

const Placeholder = ({ n }: { n: number }) => (
  <div style={{ height: 240, background: '#fff', borderRadius: 12, padding: 16 }}>Карточка {n}</div>
)

const cards = (count: number) =>
  Array.from({ length: count }, (_, i) => <Placeholder key={i} n={i + 1} />)

export const Popular: Story = {
  render: (args) => <StandardSection {...args}>{cards(12)}</StandardSection>,
}

export const New: Story = {
  args: { title: 'Новое' },
  render: (args) => <StandardSection {...args}>{cards(9)}</StandardSection>,
}

export const FewItems: Story = {
  render: (args) => <StandardSection {...args}>{cards(4)}</StandardSection>,
}
