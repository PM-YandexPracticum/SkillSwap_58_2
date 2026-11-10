import { CategoryList, CategoryListProps } from '../CategoryList'
import styles from './SkillsGrid.module.css'

interface SkillsGridProps {
  className?: string
  categoryList: CategoryListProps[]
}

export const SkillsGrid = ({ className='', categoryList }: SkillsGridProps) => {
  return (
    <ul className={`${styles.categoryList} ${className}`}>
      {categoryList.map((category) => (
        <li key={category.title} className={styles.categoryInfo}>
          <CategoryList icon={category.icon} color={category.color} title={category.title} items={category.items}  />
        </li>
      ))}
    </ul>
  )
}
