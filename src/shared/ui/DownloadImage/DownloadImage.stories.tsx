import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageUploader } from './DownloadImage';

const meta: Meta<typeof ImageUploader> = {
  title: 'Components/ImageUploader',
  component: ImageUploader,
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
        <div style={{ maxWidth: 436, padding: 24 }}>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onFileSelect: (file) => console.log('Файл выбран:', file.name),
  },
};

export const Interactive: Story = {
  render: () => {
    return (
      <ImageUploader
        placeholderText="Перетащите или выберите изображения навыка"
        buttonText="Выбрать изображения"
        onFileSelect={(file) => console.log('✅ Загружен файл:', file.name, file.size, 'байт')}
      />
    );
  },
};