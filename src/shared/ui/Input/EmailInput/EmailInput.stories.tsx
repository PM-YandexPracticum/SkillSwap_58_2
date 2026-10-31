import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { EmailInput } from './EmailInput';

const meta: Meta<typeof EmailInput> = {
  title: 'Components/Forms/EmailInput',
  component: EmailInput,
  tags: ['autodocs'],
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
    label: 'Email',
    placeholder: 'Введите email',
  },
};

export const WithError: Story = {
  args: {
    value: 'test@test.ru',
    onChange: () => {},
    label: 'Email',
    error: true,
    errorMessage: 'Email уже используется',
  },
};

export const Interactive: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    
    return (
      <EmailInput
        value={email}
        onChange={setEmail}
        label="Email"
        placeholder="Введите email"
      />
    );
  },
};