import { SkillsGrid } from '@/shared/ui/SkillsGrid/SkillsGrid'
import styles from './SkillsPage.module.css'
import {
  selectLoading,
  selectSkillCategories,
} from '@/entities/skills/selectors/skillCategoriesSelectors'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loadSkillCategories } from '@/entities/skills/model/skillCategoriesSlice'

export default function SkillsPage() {
  const skills = useAppSelector(selectSkillCategories)
  const loading = useAppSelector(selectLoading)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(loadSkillCategories())
  }, [dispatch])
  return (
    <main>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className={styles.skillsPage}>
          <SkillsGrid categoryList={skills.map(skill => {
            return {
              color: skill.color,
              icon: (<img src={`/db/${skill.icon}`} />),
              title: skill.category,
              items: skill.subcategories
            }
          })} />
        </div>
      )}
    </main>
  )
}
