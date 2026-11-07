import { InputProps } from '@/shared/types'
import Upload from '../../../assets/icons/UploadImage.svg?react'
import { Input } from '../Input'
import styles from './ImageInput.module.css'
import { useState } from 'react'

interface ImageInputProps extends Omit<
  InputProps,
  'type' | 'clear' | 'helperText' | 'leftIcon' | 'rightIcon' | 'error' | 'errorMessage'
> {
  onSave?: (value: string | null) => void
  onRemove?: () => void
}

export const ImageInput = ({
  label,
  className = '',
  onSave,
  onChange,
  onRemove,
}: ImageInputProps) => {
  const [url, setUrl] = useState<string>('')
  const [preview, setPreview] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const handleLoadFromUrl = () => {
    setErrorMessage('')
    if (!url.trim()) {
      setErrorMessage('Введите URL изображения')
      return
    }

    if (!/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url) && !url.startsWith('data:image')) {
      setErrorMessage('URL должен указывать на изображение')
      return
    }
    const img = new Image()
    img.src = url

    img.onload = () => {
      setPreview(url)
      onSave?.(url)
    }

    img.onerror = () => {
      setPreview('')
      setErrorMessage('Не удалось загрузить изображение')
    }
  }

  const handleRemove = () => {
    setUrl('')
    setPreview('')
    setErrorMessage('')
    onRemove?.()
  }

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {preview ? (
        <div className={styles.previewContainer}>
          <img src={preview} alt="Превью" className={styles.preview} />
          <button
            type="button"
            className={styles.removeButton}
            onClick={handleRemove}
            aria-label="Удалить изображение"
          >
            ×
          </button>
        </div>
      ) : (
        <Input
          value={url}
          onChange={(value) => {
            setUrl(value)
          }}
          placeholder="Введите URL"
          label={label}
          containerClassName={styles.container}
          rightIcon={
            <button
              onClick={() => {
                handleLoadFromUrl()
                onChange?.(url)
              }}
              type="button"
              className={styles.imgButton}
            >
              <Upload />
            </button>
          }
          errorMessage={errorMessage}
        />
      )}
    </div>
  )
}
