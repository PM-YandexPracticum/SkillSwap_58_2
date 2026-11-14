import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CloseButton } from './CloseButton';

const meta: Meta<typeof CloseButton> = {
  title: 'Components/Buttons/CloseButton',
  component: CloseButton,
  args: { 
    text: 'Закрыть' 
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
  decorators: [
    (Story) => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        width: '100%'
      }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CloseButton>;

export const Default: Story = {};

export const Interactive: Story = {
  render: (args) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return <></>;

    return (
      <CloseButton 
        {...args} 
        onClick={() => {
          args.onClick?.({} as React.MouseEvent<HTMLButtonElement>);
          setIsVisible(false);        
        }} 
      />
    );
  },
};