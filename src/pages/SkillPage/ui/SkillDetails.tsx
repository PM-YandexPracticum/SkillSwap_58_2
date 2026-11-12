import ClockIcon from '@/shared/assets/icons/Clock.svg?react'
import MoreIcon from '@/shared/assets/icons/More.svg?react'
import ShareIcon from '@/shared/assets/icons/Share.svg?react'
import { Button } from '@/shared/ui/Button'
import { Gallery } from '@/shared/ui/Gallery'
import type { GalleryImage } from '@/shared/ui/Gallery'
import { LikeComponent } from '@/shared/ui/Like/Like'
import styles from './SkillDetails.module.css'

export interface SkillDetailsProps {
  title: string
  category: string
  subcategory: string
  description: string
  images: GalleryImage[]
  likes: number
  isExchangeProposed: boolean
  onProposeExchange: () => void
}

export function SkillDetails({
  title,
  category,
  subcategory,
  description,
  images,
  likes,
  isExchangeProposed,
  onProposeExchange,
}: SkillDetailsProps) {
  return (
    <section className={styles.card}>
      <div className={styles.info}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.category}>
            {category} / {subcategory}
          </p>
        </div>

        <p className={styles.description}>{description}</p>

        {isExchangeProposed ? (
          <Button className={styles.button} variant="secondary">
            <ClockIcon width={24} height={24} aria-hidden="true" />
            Обмен предложен
          </Button>
        ) : (
          <Button className={styles.button} onClick={onProposeExchange}>
            Предложить обмен
          </Button>
        )}
      </div>

      <Gallery images={images} />

      <div className={styles.actions}>
        <LikeComponent counter={likes} />
        <button type="button" className={styles.action} aria-label="Поделиться">
          <ShareIcon width={24} height={24} aria-hidden="true" />
        </button>
        <button type="button" className={styles.action} aria-label="Ещё">
          <MoreIcon width={24} height={24} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
