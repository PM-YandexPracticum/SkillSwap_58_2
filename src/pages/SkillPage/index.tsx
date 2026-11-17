import { useCallback, useEffect, useState } from 'react'
import { generatePath, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { SliderSection } from '@/widgets/Sections/SliderSection'
import { SkillCard } from '@/widgets/SkillCard'
import { toSkillCardProps } from '@/pages/CatalogPage/lib/toSkillCardProps'
import {
  loadFilterOptions,
  selectCategoryOptions,
  selectFilterError,
  selectFilterStatus,
} from '@/features/catalog-filter/model/filterSlice'
import { useFavorite } from '@/features/auth/model/useFavorite'
import { selectIsAuth } from '@/features/auth/model/authSlice'
import { proposeExchange, selectProposedTo } from '@/features/exchange/model/exchangeSlice'
import { loadUsers, selectUsers, selectUsersError, selectUsersStatus } from '@/entities/user/model/usersSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Toast } from '@/shared/ui/Toast'
import { ROUTES } from '@/shared/lib/constants'
import type { UserProfile } from '@/shared/types'
import { ExchangeModal } from './ui/ExchangeModal'
import { ProfileCard } from './ui/ProfileCard'
import { SkillDetails } from './ui/SkillDetails'
import { LoadError } from '@/shared/ui/LoadError/LoadError'
import styles from './SkillPage.module.css'
import { resolveDbAsset } from '@/shared/lib/assets'

const SIMILAR_LIMIT = 8

const NOT_FOUND_PATH = '/not-found'

export default function SkillPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectUsers)
  const usersStatus = useAppSelector(selectUsersStatus)
  const usersError = useAppSelector(selectUsersError)
  const categories = useAppSelector(selectCategoryOptions)
  const filterStatus = useAppSelector(selectFilterStatus)
  const filterError = useAppSelector(selectFilterError)

  useEffect(() => {
    if (usersStatus === 'idle') dispatch(loadUsers())
  }, [dispatch, usersStatus])

  useEffect(() => {
    if (filterStatus === 'idle') dispatch(loadFilterOptions())
  }, [dispatch, filterStatus])

  if (usersStatus === 'failed') {
    return (
      <main className={styles.page}>
        <LoadError message={usersError || 'Не удалось загрузить страницу навыка'} />
      </main>
    )
  }

  if (usersStatus !== 'succeeded' || filterStatus === 'idle' || filterStatus === 'loading') {
    return <main className={styles.page} />
  }

  const user =
    id !== undefined && /^\d+$/.test(id) ? users.find((item) => item.id === Number(id)) : undefined

  if (!user) return <Navigate to={NOT_FOUND_PATH} replace />

  const similarUsers = users.filter((item) => item.id !== user.id).slice(0, SIMILAR_LIMIT)

  return (
    <SkillPageContent
      key={user.id}
      user={user}
      similarUsers={similarUsers}
      filterError={filterStatus === 'failed' ? filterError || 'Не удалось загрузить фильтры' : ''}
      categories={categories}
    />
  )
}

interface SkillPageContentProps {
  user: UserProfile
  similarUsers: UserProfile[]
  filterError: string
  categories: ReturnType<typeof selectCategoryOptions>
}

function SkillPageContent({ user, similarUsers, filterError, categories }: SkillPageContentProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuth = useAppSelector(selectIsAuth)
  const proposedTo = useAppSelector(selectProposedTo)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isToastVisible, setIsToastVisible] = useState(false)
  const { getLikeProps } = useFavorite()

  const { can_teach: skill } = user
  const cardProps = toSkillCardProps(user, categories)
  const isExchangeProposed = proposedTo.includes(user.id)
  const closeToast = useCallback(() => setIsToastVisible(false), [])

  const handleProposeExchange = () => {
    if (!isAuth) {
      navigate(ROUTES.LOGIN, { state: { from: location } })
      return
    }

    void dispatch(proposeExchange({ userId: user.id, userName: user.name }))
    setIsModalOpen(true)
    setIsToastVisible(true)
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location])

  return (
    <main className={styles.page}>
      {filterError && <LoadError message={filterError} />}
      <div className={styles.skill}>
        <ProfileCard {...cardProps} bio={user.bio} />
        <SkillDetails
          title={skill.name}
          category={skill.category}
          subcategory={skill.subcategory}
          description={skill.description}
          images={skill.images.map((path) => ({ src: resolveDbAsset(path) }))}
          likes={user.likes}
          isExchangeProposed={isExchangeProposed}
          onProposeExchange={handleProposeExchange}
        />
      </div>

      <SliderSection title="Похожие предложения">
        {similarUsers.map((item) => {
          const similarProps = toSkillCardProps(item, categories)
          return (
            <SkillCard
              key={item.id}
              {...similarProps}
              user={{ ...similarProps.user, ...getLikeProps(item.id) }}
              onDetailsClick={() => {
                navigate(generatePath(ROUTES.SKILL, {id: item.id.toString()}))
              }}
            />
          )
        })}
      </SliderSection>

      <ExchangeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {isToastVisible && <Toast onClose={closeToast}>Вы предложили обмен {user.name}</Toast>}
    </main>
  )
}
