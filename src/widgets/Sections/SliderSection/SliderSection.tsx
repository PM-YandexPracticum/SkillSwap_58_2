import { Children, useState } from 'react'
import type { ReactNode } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import styles from './SliderSection.module.css'

const SLIDES_PER_VIEW = 4
const SPACE_BETWEEN = 24

export interface SliderSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export function SliderSection({ title, children, className }: SliderSectionProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  const items = Children.toArray(children)
  const classNames = [styles.section, className].filter(Boolean).join(' ')

  const syncEdges = (instance: SwiperType) => {
    setIsBeginning(instance.isBeginning)
    setIsEnd(instance.isEnd)
  }

  return (
    <section className={classNames}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.slider}>
        <Swiper
          slidesPerView={SLIDES_PER_VIEW}
          spaceBetween={SPACE_BETWEEN}
          onSwiper={(instance) => {
            setSwiper(instance)
            syncEdges(instance)
          }}
          onSlideChange={syncEdges}
          onResize={syncEdges}
        >
          {items.map((item, index) => (
            <SwiperSlide key={index}>{item}</SwiperSlide>
          ))}
        </Swiper>

        {!isBeginning && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.prev}`}
            onClick={() => swiper?.slidePrev()}
            aria-label="Назад"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M10 3l-5 5 5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {!isEnd && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={() => swiper?.slideNext()}
            aria-label="Вперёд"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </section>
  )
}
