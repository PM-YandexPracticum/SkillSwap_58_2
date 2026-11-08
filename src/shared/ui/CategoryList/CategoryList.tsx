import type { ReactNode } from 'react'
import styles from './CategoryList.module.css'

export interface CategoryListProps {
  /** Иконка категории (например, svg) */
  icon: ReactNode
  /** Цвет фона круга под иконкой */
  color: string
  title: string
  items: string[]
  className?: string
}

export function CategoryList({ icon, color, title, items, className }: CategoryListProps) {
  const classNames = [styles.category, className].filter(Boolean).join(' ')

  return (
    <div className={classNames}>
      <div className={styles.header}>
        <span className={styles.icon} style={{ backgroundColor: color }}>
          {icon}
        </span>
        <h3 className={styles.title}>{title}</h3>
      </div>

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item} className={styles.item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
