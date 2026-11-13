import { Suspense } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout, selectAuthUser } from '@/features/auth/model/authSlice'
import { setSearchQuery, selectFilter } from '@/features/catalog-filter/model/filterSlice'
import { ROUTES } from '@/shared/lib/constants'
import styles from './MainLayout.module.css'

const links = {
  skills: 'skills',
}

export function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectAuthUser)
  const searchQuery = useAppSelector((state) => selectFilter(state).searchQuery)

  const handleLogout = async () => {
    await dispatch(logout())
    navigate(ROUTES.HOME)
  }

  return (
    <div className={styles.layout}>
      <Header
        user={user}
        searchValue={searchQuery}
        onSearchChange={(query) => dispatch(setSearchQuery(query))}
        onSearch={(query) => dispatch(setSearchQuery(query))}
        onLoginClick={() => navigate(ROUTES.LOGIN)}
        onRegisterClick={() => navigate(ROUTES.REGISTER)}
        onFavoritesClick={() => navigate(ROUTES.FAVORITES)}
        isFavoritesActive={location.pathname === ROUTES.FAVORITES}
        onProfileClick={() => navigate(ROUTES.PROFILE)}
        onLogoutClick={handleLogout}
      />
      <Suspense fallback={<div>Загрузка...</div>}>
        <Outlet />
      </Suspense>
      <div className={styles.footer}>
        <Footer links={links} />
      </div>
    </div>
  )
}
