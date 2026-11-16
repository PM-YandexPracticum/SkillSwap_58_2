// TODO: реализовать страницу FavoritesPage

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '@/widgets/Sidebar'
import { InfinityScrollSection } from '@/widgets/Sections/InfinityScrollSection'
import { SkillCard } from '@/widgets/SkillCard'
import { Button } from '@/shared/ui/Button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectFavoriteIds } from '@/features/auth/model/authSlice'
import { useFavorite } from '@/features/auth/model/useFavorite'
import {
  loadFilterOptions,
  selectCategoryOptions,
  selectCityOptions,
  selectFilter,
  selectFilterError,
  selectFilterStatus,
} from '@/features/catalog-filter/model/filterSlice'
import { filterUsers } from '@/features/catalog-filter/model/filterUsers'
import {
  loadUsers,
  RECOMMENDED_STEP,
  SECTION_LIMIT,
  selectUsers,
  selectUsersError,
  selectUsersStatus,
} from '@/entities/user/model/usersSlice'
import { toSkillCardProps } from '@/pages/CatalogPage/lib/toSkillCardProps'
import { ROUTES } from '@/shared/lib/constants'
import type { UserProfile } from '@/shared/types'
import { LoadError } from '@/shared/ui/LoadError/LoadError'
import styles from './FavoritesPage.module.css'

export default function FavoritesPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const favoriteIds = useAppSelector(selectFavoriteIds)
  const users = useAppSelector(selectUsers)
  const usersStatus = useAppSelector(selectUsersStatus)
  const usersError = useAppSelector(selectUsersError)
  const filter = useAppSelector(selectFilter)
  const filterStatus = useAppSelector(selectFilterStatus)
  const filterError = useAppSelector(selectFilterError)
  const categories = useAppSelector(selectCategoryOptions)
  const cities = useAppSelector(selectCityOptions)
  const { getLikeProps } = useFavorite()
  const [visibleCount, setVisibleCount] = useState(SECTION_LIMIT)

  useEffect(() => {
    if (filterStatus === 'idle') dispatch(loadFilterOptions())
  }, [dispatch, filterStatus])

  useEffect(() => {
    if (usersStatus === 'idle') dispatch(loadUsers())
  }, [dispatch, usersStatus])

  // Порядок как в массиве favorites; снятый лайк сразу убирает карточку
  const favoriteUsers = useMemo(
    () =>
      favoriteIds
        .map((id) => users.find((user) => user.id === id))
        .filter((user): user is UserProfile => Boolean(user)),
    [favoriteIds, users],
  )

  const filteredUsers = useMemo(() => filterUsers(favoriteUsers, filter), [favoriteUsers, filter])
  const visibleUsers = filteredUsers.slice(0, visibleCount)
  const isEmpty = usersStatus === 'succeeded' && favoriteUsers.length === 0

  return (
    <main>
      <div className={styles.layout}>
        {filterStatus === 'succeeded' && <Sidebar categories={categories} cities={cities} />}
        {filterStatus === 'failed' && <LoadError message={filterError || 'Не удалось загрузить фильтры'} />}

        <div className={styles.content}>
          {isEmpty && (
            <section className={styles.empty}>
              <h2 className={styles.title}>Избранное</h2>
              <p className={styles.text}>Вы пока никого не добавили в избранное</p>
              <Button onClick={() => navigate(ROUTES.HOME)}>Вернуться в каталог</Button>
            </section>
          )}

          {usersStatus === 'succeeded' && !isEmpty && (
            <InfinityScrollSection
              title="Избранное"
              hasMore={visibleCount < filteredUsers.length}
              onLoadMore={() =>
                setVisibleCount((count) => Math.min(count + RECOMMENDED_STEP, filteredUsers.length))
              }
            >
              {visibleUsers.length > 0 ? (
                visibleUsers.map((user) => {
                  const cardProps = toSkillCardProps(user, categories)
                  return (
                    <SkillCard
                      key={user.id}
                      {...cardProps}
                      user={{ ...cardProps.user, ...getLikeProps(user.id) }}
                    />
                  )
                })
              ) : (
                <p className={styles.emptyState}>По выбранным условиям ничего не найдено</p>
              )}
            </InfinityScrollSection>
          )}

          {usersStatus === 'failed' && <LoadError message={usersError || 'Не удалось загрузить пользователей'} />}
        </div>
      </div>
    </main>
  )
}
