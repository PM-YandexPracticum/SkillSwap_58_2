import type { Meta, StoryObj } from '@storybook/react-vite';
import LikeIcon from '../shared/assets/icons/Like.svg?react';

const IconsGallery = () => {
  const iconStyle = { width: '24px', height: '24px', color: '#253017' };

  return (
    <div style={{ display: 'flex', gap: '24px', padding: '20px', flexWrap: 'wrap', fontFamily: 'sans-serif' }}>
      {/* Начало блока. При добавлении новой иконки продублировать блок и импортировать нужную иконку */}
      <div style={{ textAlign: 'center' }}>
        <LikeIcon style={iconStyle} />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Like</p>
      </div>
      {/* Конец блока */}
    </div>
  );
};

const meta: Meta<typeof IconsGallery> = {
  title: 'Icons',
  component: IconsGallery,
};

export default meta;
type Story = StoryObj<typeof IconsGallery>;

export const AllIcons: Story = {};

