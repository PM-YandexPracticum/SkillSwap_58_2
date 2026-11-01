import { Meta, StoryObj } from "@storybook/react-vite";
import { SkillLabel } from "./SkillLabel";

const meta: Meta<typeof SkillLabel> = {
    title: 'Component/SkillLabel',
    component: SkillLabel,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div>
                <Story/>
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SkillLabelExample: Story = {
  args: {
    label: 'Тайм менеджмент',
    color: '#E7F2F6',
  }, 
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      <SkillLabel label="Тайм менеджмент" color="#E7F2F6" />
      <SkillLabel label="Медитация" color="#E9F7E7" />
      <SkillLabel label="Английский язык" color="#EBE5C5" />
      <SkillLabel label="Бизнес-план" color="#EEE7F7" />
      <SkillLabel label="Игра на барабанах" color="#F7E7F2" />
      <SkillLabel label="Ремонт" color="#F7EBE5" />
      <SkillLabel count={2} />
    </div>
  ),
};