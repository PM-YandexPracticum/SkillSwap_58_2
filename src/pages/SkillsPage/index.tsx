import { SkillsGrid } from '@/shared/ui/SkillsGrid/SkillsGrid'
import { LoadError } from '@/shared/ui/LoadError/LoadError'
import styles from './SkillsPage.module.css'
import {
  selectLoading,
  selectSkillCategories,
  selectSkillCategoriesError,
} from '@/entities/skills/selectors/skillCategoriesSelectors'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loadSkillCategories } from '@/entities/skills/model/skillCategoriesSlice'

export default function SkillsPage() {
  const skills = useAppSelector(selectSkillCategories)
  const error = useAppSelector(selectSkillCategoriesError)
  const loading = useAppSelector(selectLoading)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(loadSkillCategories())
  }, [dispatch])
  return (
    <main>
      {loading ? (
        <div>Загрузка...</div>
      ) : error ? (
        <LoadError message={error} />
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
