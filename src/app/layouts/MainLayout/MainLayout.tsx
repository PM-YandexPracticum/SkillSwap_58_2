import { Suspense, useState, useRef } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { SkillsModal } from '@/shared/ui/SkillsModal/SkillsModal'
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
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectAuthUser)
  const searchQuery = useAppSelector((state) => selectFilter(state).searchQuery)

  const [isSkillsOpen, setIsSkillsOpen] = useState(false)
  const skillsButtonRef = useRef<HTMLButtonElement>(null)

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
        onProfileClick={() => navigate(ROUTES.PROFILE)}
        onLogoutClick={handleLogout}
        onSkillsClick={() => setIsSkillsOpen(true)}
        skillsButtonRef={skillsButtonRef}
      />
      <Suspense fallback={<div>Загрузка...</div>}>
        <Outlet />
      </Suspense>
      <div className={styles.footer}>
        <Footer links={links} />
      </div>

      <SkillsModal
        isOpen={isSkillsOpen}
        onClose={() => setIsSkillsOpen(false)}
        anchorRef={skillsButtonRef}
      />

    </div>
  )
}