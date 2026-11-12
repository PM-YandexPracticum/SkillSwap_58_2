import type { Meta, StoryObj } from '@storybook/react-vite';
import LikeIcon from '../shared/assets/icons/Like.svg?react';
import CrossIcon from '../shared/assets/icons/Cross.svg?react';
import CheckboxEmptyIcon from '../shared/assets/icons/CheckboxEmpty.svg?react';
import CheckboxDoneIcon from '../shared/assets/icons/CheckboxDone.svg?react';
import CheckboxRemoveIcon from '../shared/assets/icons/CheckboxRemove.svg?react';
import Chevron from '../shared/assets/icons/Chevron.svg?react';
import ShareIcon from '../shared/assets/icons/Share.svg?react';
import MoreIcon from '../shared/assets/icons/More.svg?react';
import ClockIcon from '../shared/assets/icons/Clock.svg?react';
import BellLargeIcon from '../shared/assets/icons/BellLarge.svg?react';

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
      <div style={{ textAlign: 'center' }}>
        <LikeIcon style={iconStyle} />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Like</p>
      </div>

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
      <div style={{ textAlign: 'center' }}>
        <ShareIcon style={iconStyle} />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Share</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <MoreIcon style={iconStyle} />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>More</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <ClockIcon style={iconStyle} />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Clock</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <BellLargeIcon style={iconStyle} />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Bell Large</p>
      </div>
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