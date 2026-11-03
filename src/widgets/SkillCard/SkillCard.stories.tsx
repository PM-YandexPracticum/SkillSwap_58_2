import type { Meta, StoryObj } from '@storybook/react-vite'
import { SkillCard } from './SkillCard'
import photo from '../../shared/ui/Avatar/avatar-example.svg'

const meta: Meta<typeof SkillCard> = {
  title: 'Widgets/SkillCard',
  component: SkillCard,
  tags: ['autodocs'],
  argTypes: {
    onDetailsClick: { action: 'details clicked' },
  },
  args: {
    user: {
      avatar: photo,
      name: 'Илона',
      city: 'Екатеринбург',
      birth_date: '1993-05-02',
      likes: 0,
    },
    canTeach: { label: 'Английский язык', color: '#EBE5C5' },
    wantToLearn: [
      { label: 'Тайм менеджмент', color: '#E7F2F6' },
      { label: 'Медитация', color: '#E9F7E7' },
      { label: 'Игра на барабанах', color: '#F7E7F2' },
      { label: 'Бизнес-план', color: '#EEE7F7' },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, backgroundColor: '#F9FAF7' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof SkillCard>

export const Default: Story = {}

export const FewTags: Story = {
  args: {
    wantToLearn: [{ label: 'Медитация', color: '#E9F7E7' }],
  },
}
