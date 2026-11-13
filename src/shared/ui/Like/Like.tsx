import { useState } from 'react'
import Like from '../../assets/icons/Like.svg?react'
import styles from './Like.module.css'

interface LikeProps {
  counter?: number
  isLiked?: boolean
  onChange?: (counter: number, isLiked: boolean) => void
}

const formatCounter = (counter: number): string => {
  if (counter >= 1000000) return `${(counter / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  else if (counter >= 1000) return `${(counter / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return String(counter)
}

export const LikeComponent: React.FC<LikeProps> = ({ counter = 0, isLiked = false, onChange }) => {
  const [liked, setLiked] = useState(isLiked)
  const [count, setCount] = useState(counter)
  const [prevIsLiked, setPrevIsLiked] = useState(isLiked)

  // Состояние пришло снаружи (например, из Redux) — подстраиваемся под него
  if (isLiked !== prevIsLiked) {
    setPrevIsLiked(isLiked)
    setLiked(isLiked)
  }

  const handleClick = () => {
    const nextLiked = !liked
    const nextCount = nextLiked ? count + 1 : count - 1
    setLiked(nextLiked)
    setCount(nextCount)
    onChange?.(nextCount, nextLiked)
  }

  return (
    <div
      className={liked ? `${styles.like} ${styles.isliked}` : `${styles.like}`}
      aria-pressed={liked}
    >
      <span className={styles.counter}>{formatCounter(count)}</span>
      <button
        type="button"
        className={styles.button}
        onClick={handleClick}
        aria-label={liked ? 'Убрать из избранного' : 'Добавить в избранное'}
      >
        <Like />
      </button>
    </div>
  )
}
