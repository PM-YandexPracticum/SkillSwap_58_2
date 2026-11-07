import { Meta, StoryObj } from '@storybook/react-vite'
import { AvatarUploader } from './AvatarUploader'
import Add from '../../assets/icons/Add.svg?react'
import GalleryEdit from '../../assets/icons/GalleryEdit.svg?react'
import { ImageUploader } from '../DownloadImage/DownloadImage'
import { useState } from 'react'
import { ImageInput } from '../Input/ImageInput/ImageInput'

const meta: Meta<typeof AvatarUploader> = {
  title: 'Component/DownloadAvatar',
  component: AvatarUploader,
  tags: ['autodocs'],
  args: {
    buttonIcon: <Add />,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 244, height: 244, marginLeft: 90 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  args: {
    inputComponent: (
      <ImageUploader
        placeholderText="Перетащите или выберите изображение"
        buttonText="Выбрать изображение"
      />
    ),
  },
}

const ImageEditFileUpload = () => {
  const [url, setUrl] = useState('')
  return (
    <AvatarUploader
      url={url}
      buttonIcon={<GalleryEdit />}
      onRemove={() => {
        setUrl('')
      }}
      inputComponent={
        <ImageUploader
          onFileSelect={(file) => {
            const reader = new FileReader()
            reader.onload = (e) => {
              setUrl(e.target?.result as string)
            }
            reader.readAsDataURL(file)
          }}
          placeholderText="Перетащите или выберите изображение"
          buttonText="Выбрать изображение"
          onRemove={() => {
            setUrl('')
          }}
        />
      }
    />
  )
}

const ImageEditUrlUpload = () => {
  const [url, setUrl] = useState('')
  return (
    <AvatarUploader
      url={url}
      buttonIcon={<GalleryEdit />}
      onRemove={() => {
        setUrl('')
      }}
      inputComponent={
        <ImageInput
          onRemove={() => {
            setUrl('')
          }}
          value={url}
          label="URL изображения"
          onChange={setUrl}
        />
      }
    />
  )
}

const ImageAddFileUpload = () => {
  const [url, setUrl] = useState('')
  return (
    <AvatarUploader
      url={url}
      onRemove={() => {
        setUrl('')
      }}
      buttonIcon={<Add />}
      inputComponent={
        <ImageUploader
          onFileSelect={(file) => {
            const reader = new FileReader()
            reader.onload = (e) => {
              setUrl(e.target?.result as string)
            }
            reader.readAsDataURL(file)
          }}
          placeholderText="Перетащите или выберите изображение"
          buttonText="Выбрать изображение"
          onRemove={() => {
            setUrl('')
          }}
        />
      }
    />
  )
}

const ImageAddUrlUpload = () => {
  const [url, setUrl] = useState('')
  return (
    <AvatarUploader
      url={url}
      onRemove={() => {
        setUrl('')
      }}
      buttonIcon={<Add />}
      inputComponent={
        <ImageInput
          onRemove={() => {
            setUrl('')
          }}
          value={url}
          label="URL изображения"
          onChange={setUrl}
        />
      }
    />
  )
}

export const OnEdit: Story = {
  render: () => <ImageEditFileUpload />,
}

export const OnEditUrl: Story = {
  render: () => <ImageEditUrlUpload />,
}

export const OnAdd: Story = {
  render: () => <ImageAddFileUpload />,
}

export const OnAddUrl: Story = {
  render: () => <ImageAddUrlUpload />,
}
