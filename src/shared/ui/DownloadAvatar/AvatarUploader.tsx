import { ReactNode, useState } from 'react'
import { Avatar } from '../Avatar/Avatar'
import { Button } from '../Button/Button'
import styles from './AvatarUploader.module.css'
import plug from './Plug.svg'

interface AvatarUploaderProps {
  url?: string
  inputComponent: ReactNode
  buttonIcon: ReactNode
  onRemove?: () => void
  size?: number
  className?: string
}

export const AvatarUploader = ({
  url,
  inputComponent,
  buttonIcon,
  onRemove,
  size,
  className = '',
}: AvatarUploaderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [avatar, setAvatar] = useState<string | undefined>('')

  return (
    <div
      className={`${styles.wrap} ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <Avatar className={styles.plug} src={avatar ? avatar : plug} alt="Аватар пользователя" />
      <button
        className={styles.addButton}
        type="button"
        onClick={() => {
          if (!isOpen) setIsOpen(true)
          else setIsOpen(false)
        }}
      >
        {buttonIcon}
      </button>
      {isOpen && (
        <div className={styles.imgUploader}>
          {inputComponent}
          <Button
            onClick={() => {
              setIsOpen(false)
              setAvatar(url)
              onRemove?.()
            }}
            disabled={url ? false : true}
          >
            {'Выбрать'}
          </Button>
        </div>
      )}
    </div>
  )
}
