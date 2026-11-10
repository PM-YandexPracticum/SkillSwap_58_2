import { Suspense } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout, selectAuthUser } from '@/features/auth/model/authSlice'
import { ROUTES } from '@/shared/lib/constants'
import styles from './MainLayout.module.css'

export function MainLayout() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectAuthUser)

  const handleLogout = async () => {
    await dispatch(logout())
    navigate(ROUTES.HOME)
  }

  return (
    <div className={styles.layout}>
      <Header
        user={user}
        onLoginClick={() => navigate(ROUTES.LOGIN)}
        onRegisterClick={() => navigate(ROUTES.REGISTER)}
        onFavoritesClick={() => navigate(ROUTES.FAVORITES)}
        onProfileClick={() => navigate(ROUTES.PROFILE)}
        onLogoutClick={handleLogout}
      />
      <Suspense fallback={<div>Загрузка...</div>}>
        <Outlet />
      </Suspense>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
}
