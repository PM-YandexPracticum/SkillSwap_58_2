import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';

//Навигация
import ChevronIcon from './Chevron.svg?react';
import ChevronDownIcon from './ChevronDown.svg?react';
import SearchIcon from './Search.svg?react';
import MoreIcon from './More.svg?react';
import ShareIcon from './Share.svg?react';

//Выборы и формы
import CheckboxEmptyIcon from './CheckboxEmpty.svg?react';
import CheckboxDoneIcon from './CheckboxDone.svg?react';
import CheckboxRemoveIcon from './CheckboxRemove.svg?react';
import EyePasswordIcon from './EyePassword.svg?react';

//Действия
import PencilIcon from './Pencil.svg?react';
import LogoutIcon from './Logout.svg?react';
import UploadImageIcon from './UploadImage.svg?react';
import GalleryEditIcon from './GalleryEdit.svg?react';
import LikeIcon from './Like.svg?react';

//Коммуникация
import MessageIcon from './Message.svg?react';
import NotificationIcon from './Notification.svg?react';
import EnvelopeIcon from './Envelope.svg?react';
import BellLargeIcon from './BellLarge.svg?react';

//Время и дата
import ClockIcon from './Clock.svg?react';
import CalendarIcon from './Calendar.svg?react';

//Пользователь и тема
import UserIcon from './User.svg?react';
import MoonIcon from './Moon.svg?react';
import SunIcon from './Sun.svg?react';

//Медия
import LogoIcon from './Logo.svg?react';
import GoogleIcon from './Google.svg?react';
import IdeaIcon from './Idea.svg?react';

import CrossIcon from './Cross.svg?react';

const IconsGallery = () => {
  const iconStyle: CSSProperties = { width: '24px', height: '24px', color: '#253017' }
  const labelStyle: CSSProperties = { marginTop: '8px', fontSize: '12px', color: '#69735D' }
  const rowStyle: CSSProperties = {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    padding: '16px 0',
  }
  const groupStyle: CSSProperties = { marginBottom: '32px' }
  const titleStyle: CSSProperties = {
    margin: '0 0 8px',
    fontSize: '16px',
    color: '#253017',
    borderBottom: '1px solid #e4e8df',
    paddingBottom: '8px',
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '900px' }}>

      <div style={groupStyle}>
        <h3 style={titleStyle}>Навигация</h3>
        <div style={rowStyle}>
          <div style={{ textAlign: 'center' }}>
            <ChevronIcon style={iconStyle} />
            <p style={labelStyle}>Chevron</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <ChevronDownIcon style={iconStyle} />
            <p style={labelStyle}>ChevronDown</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <SearchIcon style={iconStyle} />
            <p style={labelStyle}>Search</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <MoreIcon style={iconStyle} />
            <p style={labelStyle}>More</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <ShareIcon style={iconStyle} />
            <p style={labelStyle}>Share</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CrossIcon style={iconStyle} />
            <p style={labelStyle}>Cross</p>
          </div>
        </div>
      </div>

      <div style={groupStyle}>
        <h3 style={titleStyle}>Выбор и формы</h3>
        <div style={rowStyle}>
          <div style={{ textAlign: 'center' }}>
            <CheckboxEmptyIcon style={iconStyle} />
            <p style={labelStyle}>CheckboxEmpty</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CheckboxDoneIcon style={iconStyle} />
            <p style={labelStyle}>CheckboxDone</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CheckboxRemoveIcon style={iconStyle} />
            <p style={labelStyle}>CheckboxRemove</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <EyePasswordIcon style={iconStyle} />
            <p style={labelStyle}>EyePassword</p>
          </div>
        </div>
      </div>

      <div style={groupStyle}>
        <h3 style={titleStyle}>Действия</h3>
        <div style={rowStyle}>
          <div style={{ textAlign: 'center' }}>
            <PencilIcon style={iconStyle} />
            <p style={labelStyle}>Pencil</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <LogoutIcon style={iconStyle} />
            <p style={labelStyle}>Logout</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <UploadImageIcon style={iconStyle} />
            <p style={labelStyle}>UploadImage</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <LikeIcon style={iconStyle} />
            <p style={labelStyle}>Like</p>
          </div>
        </div>
      </div>

      <div style={groupStyle}>
        <h3 style={titleStyle}>Коммуникация</h3>
        <div style={rowStyle}>
          <div style={{ textAlign: 'center' }}>
            <MessageIcon style={iconStyle} />
            <p style={labelStyle}>Message</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <NotificationIcon style={iconStyle} />
            <p style={labelStyle}>Notification</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <BellLargeIcon style={iconStyle} />
            <p style={labelStyle}>BellLarge</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <EnvelopeIcon style={iconStyle} />
            <p style={labelStyle}>Envelope</p>
          </div>
        </div>
      </div>

      <div style={groupStyle}>
        <h3 style={titleStyle}>Время и дата</h3>
        <div style={rowStyle}>
          <div style={{ textAlign: 'center' }}>
            <ClockIcon style={iconStyle} />
            <p style={labelStyle}>Clock</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CalendarIcon style={iconStyle} />
            <p style={labelStyle}>Calendar</p>
          </div>
        </div>
      </div>

      <div style={groupStyle}>
        <h3 style={titleStyle}>Пользователь и тема</h3>
        <div style={rowStyle}>
          <div style={{ textAlign: 'center' }}>
            <UserIcon style={iconStyle} />
            <p style={labelStyle}>User</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <MoonIcon style={iconStyle} />
            <p style={labelStyle}>Moon</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <SunIcon style={iconStyle} />
            <p style={labelStyle}>Sun</p>
          </div>
        </div>
      </div>

      <div style={groupStyle}>
        <h3 style={titleStyle}>Бренд и медиа</h3>
        <div style={rowStyle}>
          <div style={{ textAlign: 'center' }}>
            <LogoIcon style={iconStyle} />
            <p style={labelStyle}>Logo</p>
          </div>
<div style={{ textAlign: 'center' }}>
            <GoogleIcon style={iconStyle} />
            <p style={labelStyle}>Google</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <GalleryEditIcon style={iconStyle} />
            <p style={labelStyle}>GalleryEdit</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IdeaIcon style={iconStyle} />
            <p style={labelStyle}>Idea</p>
          </div>
        </div>
      </div>

    </div>
  )
}

const meta: Meta<typeof IconsGallery> = {
  title: 'Icons',
  component: IconsGallery,
};

export default meta;
type Story = StoryObj<typeof IconsGallery>;

export const AllIcons: Story = {};
