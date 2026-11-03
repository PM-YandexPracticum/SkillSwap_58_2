import type { Meta, StoryObj } from '@storybook/react-vite';
import LikeIcon from '../shared/assets/icons/Like.svg?react';
import CrossIcon from '../shared/assets/icons/Cross.svg?react';
import CheckboxEmptyIcon from '../shared/assets/icons/CheckboxEmpty.svg?react';
import CheckboxDoneIcon from '../shared/assets/icons/CheckboxDone.svg?react';
import CheckboxRemoveIcon from '../shared/assets/icons/CheckboxRemove.svg?react';
import Chevron from '../shared/assets/icons/Chevron.svg?react';

const IconsGallery = () => {
  const iconStyle = { width: '24px', height: '24px', color: '#253017' };

  return (
    <div
      style={{
        display: 'flex',
        gap: '24px',
        padding: '20px',
        flexWrap: 'wrap',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Начало блока. При добавлении новой иконки продублировать блок и импортировать нужную иконку */}
      <div style={{ textAlign: 'center' }}>
        <LikeIcon style={iconStyle} />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Like</p>
      </div>

      {/* Иконка крестика */}
      <div style={{ textAlign: 'center' }}>
        <CrossIcon style={iconStyle} />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Cross</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <CheckboxEmptyIcon style={iconStyle} />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Checkbox Empty</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <CheckboxDoneIcon style={iconStyle} />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Checkbox Done</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <CheckboxRemoveIcon style={iconStyle} />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Checkbox Remove</p>
      </div>

            <div style={{ textAlign: 'center' }}>
        <Chevron style={iconStyle} />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Chevron</p>
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