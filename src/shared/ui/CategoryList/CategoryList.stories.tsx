import type { Meta, StoryObj } from '@storybook/react-vite'
import { CategoryList } from './CategoryList'

const LeafIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6 18c0-7 4-12 13-12 0 9-5 13-12 13M6 18c2-4 5-7 9-9"
      stroke="#253017"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const meta: Meta<typeof CategoryList> = {
  title: 'Shared/CategoryList',
  component: CategoryList,
  args: {
    icon: <LeafIcon />,
    color: '#e8f0dc',
    title: 'Здоровье и лайфстайл',
    items: [
      'Йога и медитация',
      'Питание и ЗОЖ',
      'Ментальное здоровье',
      'Осознанность',
      'Физические тренировки',
      'Сон и восстановление',
      'Баланс жизни и работы',
    ],
  },
}

export default meta
type Story = StoryObj<typeof CategoryList>

export const Default: Story = {}

export const ShortList: Story = {
  args: { items: ['Йога и медитация', 'Питание и ЗОЖ'] },
}
