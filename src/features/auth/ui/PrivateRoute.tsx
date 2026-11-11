import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuth } from '@/features/auth/model/authSlice'
import { ROUTES } from '@/shared/lib/constants'

export function PrivateRoute() {
  const isAuth = useAppSelector(selectIsAuth)
  const location = useLocation()

  if (!isAuth) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }

  return <Outlet />
}
