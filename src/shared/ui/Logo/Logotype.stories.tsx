import type { Meta, StoryObj } from '@storybook/react-vite';
import {Logotype} from './Logotype';

const meta: Meta<typeof Logotype> = {
    title: 'Components/Logotype',
    component: Logotype,
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
        <div style={{ padding: 24 }}>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};