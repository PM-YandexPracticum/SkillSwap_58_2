import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterLabel } from './FilterLabel';

const meta: Meta<typeof FilterLabel> = {
  title: 'Shared/FilterLabel',
  component: FilterLabel,
  args: { text: 'Хочу научиться' },
  argTypes: {
    onRemove: { action: 'removed' },
  },
};

export default meta;
type Story = StoryObj<typeof FilterLabel>;

export const Default: Story = {};

export const MultipleFilters: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <FilterLabel text="Хочу научиться" />
      <FilterLabel text="Английский" />
    </div>
  ),
};