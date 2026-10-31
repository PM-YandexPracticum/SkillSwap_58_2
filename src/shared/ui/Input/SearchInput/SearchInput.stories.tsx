import type { Meta, StoryObj } from '@storybook/react-vite';
import {SearchInput} from './SearchInput';
import { useState } from 'react';

const meta: Meta<typeof SearchInput> = {
    title: 'Components/Input',
    component: SearchInput,
    tags: ['autodocs'],
    args: {
        placeholder: 'Искать навык',
        value: '',
        onChange: () => {},
        onSearch: (query) => console.log('Поиск:', query),
    },
    decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
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

export const WithValue: Story = {
    args: {
        value: 'Какой-то текст',
        onChange: () => {},
        placeholder: 'Искать навык',
    },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <SearchInput
        value={value}
        onChange={setValue}
        onSearch={(q) => console.log('🔍 Поиск:', q)}
        placeholder="Искать навык"
      />
    );
  },
};