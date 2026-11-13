import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { ROUTES } from '@/shared/lib/constants'
import { selectFavoriteIds, selectIsAuth, toggleFavorite } from './authSlice'

/** Пропсы сердечка для карточки: закрашено ли и что делать по клику */
export function useFavorite() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuth = useAppSelector(selectIsAuth)
  const favoriteIds = useAppSelector(selectFavoriteIds)

  const getLikeProps = useCallback(
    (userId: number) => ({
      isLiked: favoriteIds.includes(userId),
      onLikeChange: () => {
        if (!isAuth) {
          navigate(ROUTES.LOGIN, { state: { from: location } })
          return
        }
        void dispatch(toggleFavorite(userId))
      },
    }),
    [dispatch, favoriteIds, isAuth, location, navigate],
  )

  return { getLikeProps }
}
