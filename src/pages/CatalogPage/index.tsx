import { useEffect } from 'react'
import { Sidebar } from '@/widgets/Sidebar'
import { StandardSection } from '@/widgets/Sections/StandardSection'
import { SkillCard } from '@/widgets/SkillCard'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  loadFilterOptions,
  selectCategoryOptions,
  selectCityOptions,
  selectFilterStatus,
} from '@/features/catalog-filter/model/filterSlice'
import {
  loadUsers,
  selectNewUsers,
  selectPopularUsers,
  selectUsersStatus,
} from '@/entities/user/model/usersSlice'
import { toSkillCardProps } from './lib/toSkillCardProps'
import styles from './CatalogPage.module.css'

export default function CatalogPage() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectCategoryOptions)
  const cities = useAppSelector(selectCityOptions)
  const filterStatus = useAppSelector(selectFilterStatus)
  const usersStatus = useAppSelector(selectUsersStatus)
  const popularUsers = useAppSelector(selectPopularUsers)
  const newUsers = useAppSelector(selectNewUsers)

  useEffect(() => {
    if (filterStatus === 'idle') dispatch(loadFilterOptions())
  }, [dispatch, filterStatus])

  useEffect(() => {
    if (usersStatus === 'idle') dispatch(loadUsers())
  }, [dispatch, usersStatus])

  return (
    <main>
      <div className={styles.layout}>
        {filterStatus === 'succeeded' && <Sidebar categories={categories} cities={cities} />}
        {filterStatus === 'failed' && <p>Не удалось загрузить фильтры</p>}

        <div className={styles.catalog}>
          {usersStatus === 'succeeded' && (
            <>
              <StandardSection title="Популярное">
                {popularUsers.map((user) => (
                  <SkillCard key={user.id} {...toSkillCardProps(user, categories)} />
                ))}
              </StandardSection>
              <StandardSection title="Новое">
                {newUsers.map((user) => (
                  <SkillCard key={user.id} {...toSkillCardProps(user, categories)} />
                ))}
              </StandardSection>
            </>
          )}
          {usersStatus === 'failed' && <p>Не удалось загрузить пользователей</p>}
        </div>
      </div>
    </main>
  )
}