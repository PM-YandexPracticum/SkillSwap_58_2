import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@/shared/ui/Input/Input';

const meta: Meta<typeof Input> = {
    title: 'Components/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        type: {control: 'select', options: ['text', 'email', 'password']},
        error: {control: 'boolean'},
        clear: {control: 'boolean'},
    },
    args: {
        placeholder: 'Введите текст',
        type: 'text',
        error: false,
        clear: false,
    },
    decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    onChange: () => {},
    placeholder: 'Искать навык',
  },
};