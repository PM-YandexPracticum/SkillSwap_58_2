import { Children, useState } from 'react'
import type { ReactNode } from 'react'
import styles from './StandardSection.module.css'

const COLUMNS = 3
const COLLAPSED_COUNT = COLUMNS
const EXPANDED_COUNT = COLUMNS * 3

export interface StandardSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export function StandardSection({ title, children, className }: StandardSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const items = Children.toArray(children)
  const visibleItems = items.slice(0, isExpanded ? EXPANDED_COUNT : COLLAPSED_COUNT)
  const classNames = [styles.section, className].filter(Boolean).join(' ')

  return (
    <section className={classNames}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
        >
          Смотреть все
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
      </div>

      <div className={styles.grid}>{visibleItems}</div>
    </section>
  )
}
