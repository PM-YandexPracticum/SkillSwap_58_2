import type { Meta, StoryObj } from '@storybook/react-vite'
import { Gallery } from './Gallery'
import photo1 from './images/photo-1.svg'
import photo2 from './images/photo-2.svg'
import photo3 from './images/photo-3.svg'
import photo4 from './images/photo-4.svg'
import photo5 from './images/photo-5.svg'
import photo6 from './images/photo-6.svg'

const meta: Meta<typeof Gallery> = {
  title: 'Shared/Gallery',
  component: Gallery,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Gallery>

const photos = [photo1, photo2, photo3, photo4, photo5, photo6].map((src, index) => ({
  src,
  alt: `Пример фото ${index + 1}`,
}))

export const Default: Story = {
  args: { images: photos },
}

export const ThreeImages: Story = {
  args: { images: photos.slice(0, 3) },
}

export const TwoImages: Story = {
  args: { images: photos.slice(0, 2) },
}

export const SingleImage: Story = {
  args: { images: photos.slice(0, 1) },
}
