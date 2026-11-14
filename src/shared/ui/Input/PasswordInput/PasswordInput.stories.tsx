import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PasswordInput } from './PasswordInput';

const meta: Meta<typeof PasswordInput> = {
  title: 'Components/Inputs/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
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
    label: 'Пароль',
    placeholder: 'Введите пароль',
  },
};

export const WithHelperText: Story = {
  args: {
    value: '',
    onChange: () => {},
    label: 'Пароль',
    placeholder: 'Придумайте надёжный пароль',
    helperText: 'Пароль должен содержать не менее 8 знаков',
  },
};

export const WithError: Story = {
  args: {
    value: 'short',
    onChange: () => {},
    label: 'Пароль',
    error: true,
    errorMessage: 'Пароль слишком короткий',
  },
};

export const Interactive: Story = {
  render: () => {
    const [password, setPassword] = useState('');
    return (
      <PasswordInput
        value={password}
        onChange={setPassword}
        label="Пароль"
        placeholder="Придумайте надёжный пароль"
        helperText="Пароль должен содержать не менее 8 знаков"
      />
    );
  },
};