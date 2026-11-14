import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Forms/Select',
  component: Select,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        width: '100%'
      }}>
        <div style={{ maxWidth: 208, padding: 24 }}>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const genderOptions = [
  { value: 'not_specified', label: 'Не указан' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
];

export const Default: Story = {
  args: {
    label: 'Пол',
    options: genderOptions,
    value: 'not_specified',
    onChange: (value) => console.log('Выбрано:', value),
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('not_specified');

    return (
      <Select
        label="Пол"
        options={genderOptions}
        value={value}
        onChange={setValue}
      />
    );
  },
};