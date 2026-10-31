import { useState } from 'react'
import type { CSSProperties } from 'react'
import styles from './Avatar.module.css'

export interface AvatarProps {
  src?: string
  alt: string
  size?: number
  className?: string
}

export function Avatar({ src, alt, size = 100, className }: AvatarProps) {
  const [hasError, setHasError] = useState(false)
  const showImage = Boolean(src) && !hasError
  const classNames = [styles.avatar, className].filter(Boolean).join(' ')
  const style = { '--avatar-size': `${size}px` } as CSSProperties

  return (
    <div className={classNames} style={style}>
      {showImage ? (
        <img className={styles.image} src={src} alt={alt} onError={() => setHasError(true)} />
      ) : (
        <span className={styles.placeholder} role="img" aria-label={alt}>
          {alt.trim().charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  )
}
