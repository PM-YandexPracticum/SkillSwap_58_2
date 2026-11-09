import { useRef, useState } from 'react'
import type { Swiper as SwiperInstance } from 'swiper'
import { Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/thumbs'
import styles from './Gallery.module.css'

export interface GalleryImage {
  src: string
  alt?: string
}

export interface GalleryProps {
  images: GalleryImage[]
  className?: string
}

const VISIBLE_THUMBS = 3
const THUMBS_GAP = 24

export function Gallery({ images, className }: GalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperInstance | null>(null)
  const [firstVisible, setFirstVisible] = useState(0)

  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  if (images.length === 0) return null

  const hasThumbs = images.length > 1
  const lastVisible = firstVisible + VISIBLE_THUMBS - 1
  const hiddenCount = images.length - 1 - lastVisible

  const classes = [styles.gallery, className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <div className={styles.mainWrap}>
        <Swiper
          className={styles.main}
          modules={[Navigation, Thumbs]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
            disabledClass: styles.arrowDisabled,
          }}
          onBeforeInit={(swiper) => {
            if (typeof swiper.params.navigation === 'object') {
              swiper.params.navigation.prevEl = prevRef.current
              swiper.params.navigation.nextEl = nextRef.current
            }
          }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={`${image.src}-${index}`}>
              <img
                className={styles.image}
                src={image.src}
                alt={image.alt ?? `Фото ${index + 1}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          ref={prevRef}
          type="button"
          className={`${styles.arrow} ${styles.prev}`}
          aria-label="Предыдущее фото"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          ref={nextRef}
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          aria-label="Следующее фото"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {hasThumbs && (
        <Swiper
          className={styles.thumbs}
          direction="vertical"
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          onSlideChange={(swiper) => setFirstVisible(swiper.activeIndex)}
          slidesPerView={VISIBLE_THUMBS}
          spaceBetween={THUMBS_GAP}
          watchSlidesProgress
        >
          {images.map((image, index) => (
            <SwiperSlide key={`${image.src}-${index}`} className={styles.thumb}>
              <img className={styles.image} src={image.src} alt={`Миниатюра ${index + 1}`} />
              {index === lastVisible && hiddenCount > 0 && (
                <span className={styles.more}>+{hiddenCount}</span>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}
