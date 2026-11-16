import { useEffect, useMemo, useState } from 'react'
import { Sidebar } from '@/widgets/Sidebar'
import { StandardSection } from '@/widgets/Sections/StandardSection'
import { InfinityScrollSection } from '@/widgets/Sections/InfinityScrollSection'
import { SkillCard } from '@/widgets/SkillCard'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { FilterLabel } from '@/shared/ui/FilterLabel'
import {
  loadFilterOptions,
  selectCategoryOptions,
  selectCityOptions,
  selectFilter,
  selectFilterError,
  selectFilterStatus,
  setCities,
  setGender,
  setSearchQuery,
  setSkillType,
  setSkills,
} from '@/features/catalog-filter/model/filterSlice'
import type { FilterState } from '@/features/catalog-filter/model/filterSlice'
import { filterUsers, hasActiveFilters } from '@/features/catalog-filter/model/filterUsers'
import {
  loadUsers,
  SECTION_LIMIT,
  RECOMMENDED_STEP,
  selectHasMoreRecommended,
  selectNewUsers,
  selectPopularUsers,
  selectRecommendedUsers,
  selectUsers,
  selectUsersError,
  selectUsersStatus,
  showMoreRecommended,
} from '@/entities/user/model/usersSlice'
import { loadSkillCategories } from '@/entities/skills/model/skillCategoriesSlice'
import { toSkillCardProps } from './lib/toSkillCardProps'
import { useFavorite } from '@/features/auth/model/useFavorite'
import type { UserProfile } from '@/shared/types'
import { LoadError } from '@/shared/ui/LoadError/LoadError'
import styles from './CatalogPage.module.css'

type ActiveFilterChip = {
  id: string
  label: string
  onRemove: () => void
}

const skillTypeLabels = {
  learn: 'Хочу научиться',
  teach: 'Могу научить',
} as const

const genderLabels = {
  male: 'Мужской',
  female: 'Женский',
} as const

function getActiveFilterChips(filter: FilterState, dispatch: ReturnType<typeof useAppDispatch>) {
  const chips: ActiveFilterChip[] = []

  if (filter.skillType !== 'all') {
    chips.push({
      id: 'skill-type',
      label: skillTypeLabels[filter.skillType],
      onRemove: () => dispatch(setSkillType('all')),
    })
  }

  filter.skills.forEach((skill) => {
    chips.push({
      id: `skill-${skill}`,
      label: skill,
      onRemove: () => dispatch(setSkills(filter.skills.filter((selected) => selected !== skill))),
    })
  })

  if (filter.gender !== 'any') {
    chips.push({
      id: 'gender',
      label: genderLabels[filter.gender],
      onRemove: () => dispatch(setGender('any')),
    })
  }

  filter.cities.forEach((city) => {
    chips.push({
      id: `city-${city}`,
      label: city,
      onRemove: () => dispatch(setCities(filter.cities.filter((selected) => selected !== city))),
    })
  })

  if (filter.searchQuery.trim()) {
    chips.push({
      id: 'search',
      label: `Поиск: ${filter.searchQuery.trim()}`,
      onRemove: () => dispatch(setSearchQuery('')),
    })
  }

  return chips
}

interface FilteredResultsProps {
  users: UserProfile[]
  categories: ReturnType<typeof selectCategoryOptions>
  chips: ActiveFilterChip[]
}

function FilteredResults({ users, categories, chips }: FilteredResultsProps) {
  const [visibleCount, setVisibleCount] = useState(SECTION_LIMIT)
  const [sortByNewest, setSortByNewest] = useState(true)
  const { getLikeProps } = useFavorite()

  const sortedUsers = useMemo(
    () =>
      sortByNewest
        ? [...users].sort((a, b) => b.date_created.localeCompare(a.date_created))
        : [...users].sort((a, b) => b.likes - a.likes),
    [sortByNewest, users],
  )

  const visibleUsers = sortedUsers.slice(0, visibleCount)

  return (
    <>
      {chips.length > 0 && (
        <div className={styles.activeFilters} aria-label="Выбранные фильтры">
          {chips.map((chip) => (
            <FilterLabel key={chip.id} text={chip.label} onRemove={chip.onRemove} />
          ))}
        </div>
      )}
      <InfinityScrollSection
        title={`Подходящие предложения: ${users.length}`}
        hasMore={visibleCount < users.length}
        onLoadMore={() =>
          setVisibleCount((count) => Math.min(count + RECOMMENDED_STEP, users.length))
        }
        headerAction={
          <button
            type="button"
            className={styles.sortButton}
            onClick={() => setSortByNewest((isNewest) => !isNewest)}
            aria-label={`Изменить сортировку. Сейчас: ${sortByNewest ? 'сначала новые' : 'сначала популярные'}`}
          >
            {sortByNewest ? 'Сначала новые' : 'Сначала популярные'}
          </button>
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
    </>
  )
}

export default function CatalogPage() {
  const dispatch = useAppDispatch()
  const filter = useAppSelector(selectFilter)
  const categories = useAppSelector(selectCategoryOptions)
  const cities = useAppSelector(selectCityOptions)
  const filterStatus = useAppSelector(selectFilterStatus)
  const filterError = useAppSelector(selectFilterError)
  const usersStatus = useAppSelector(selectUsersStatus)
  const usersError = useAppSelector(selectUsersError)
  const users = useAppSelector(selectUsers)
  const popularUsers = useAppSelector(selectPopularUsers)
  const newUsers = useAppSelector(selectNewUsers)
  const recommendedUsers = useAppSelector(selectRecommendedUsers)
  const hasMoreRecommended = useAppSelector(selectHasMoreRecommended)
  const { getLikeProps } = useFavorite()
  const filteredUsers = useMemo(() => filterUsers(users, filter), [filter, users])
  const hasFilters = hasActiveFilters(filter)
  const activeFilterChips = getActiveFilterChips(filter, dispatch)
  const filterKey = JSON.stringify([
    filter.skillType,
    filter.skills,
    filter.gender,
    filter.cities,
    filter.searchQuery,
  ])

  useEffect(() => {
    if (filterStatus === 'idle') dispatch(loadFilterOptions())
  }, [dispatch, filterStatus])

  useEffect(() => {
    if (usersStatus === 'idle') dispatch(loadUsers())
  }, [dispatch, usersStatus])

  useEffect(() => {
    dispatch(loadSkillCategories())
  }, [dispatch])

  const renderCard = (user: UserProfile) => {
    const cardProps = toSkillCardProps(user, categories)
    return (
      <SkillCard
        key={user.id}
        {...cardProps}
        user={{ ...cardProps.user, ...getLikeProps(user.id) }}
      />
    )
  }

  return (
    <main>
      <div className={styles.layout}>
        {filterStatus === 'succeeded' && <Sidebar categories={categories} cities={cities} />}
        {filterStatus === 'failed' && <LoadError message={filterError || 'Не удалось загрузить фильтры'} />}

        <div className={styles.catalog}>
          {usersStatus === 'succeeded' &&
            (hasFilters ? (
              <FilteredResults
                key={filterKey}
                users={filteredUsers}
                categories={categories}
                chips={activeFilterChips}
              />
            ) : (
              <>
                <StandardSection title="Популярное">{popularUsers.map(renderCard)}</StandardSection>
                <StandardSection title="Новое">{newUsers.map(renderCard)}</StandardSection>
                <InfinityScrollSection
                  title="Рекомендуем"
                  hasMore={hasMoreRecommended}
                  onLoadMore={() => dispatch(showMoreRecommended())}
                >
                  {recommendedUsers.map(renderCard)}
                </InfinityScrollSection>
              </>
            ))}
          {usersStatus === 'failed' && <LoadError message={usersError || 'Не удалось загрузить пользователей'} />}
        </div>
      </div>
    </main>
  )
}
