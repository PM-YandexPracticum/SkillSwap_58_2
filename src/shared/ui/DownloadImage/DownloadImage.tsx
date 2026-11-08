import { useState, useRef, useCallback } from 'react';
import styles from './DownloadImage.module.css';
import UploadImage from '../../assets/icons/UploadImage.svg?react';

interface ImageUploaderProps {
  onFileSelect?: (file: File) => void;
  onRemove?: () => void;
  className?: string;
  placeholderText?: string;
  buttonText?: string;
}

export const ImageUploader = ({
  onFileSelect,
  onRemove,
  className = '',
  placeholderText = 'Перетащите или выберите изображения навыка',
  buttonText = 'Выбрать изображения',
}: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }

    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onRemove?.();
  };

  return (
    <div
      className={`${styles.wrapper} ${className} ${isDragOver ? styles.dragOver : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className={styles.input}
        aria-label="Выбрать изображение"
      />

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
        <div className={styles.placeholder}>
          <p className={styles.placeholderText}>{placeholderText}</p>
          <button
            type="button"
            className={styles.selectButton}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <UploadImage />
            <span>{buttonText}</span>
          </button>
        </div>
      )}
    </div>
  );
};