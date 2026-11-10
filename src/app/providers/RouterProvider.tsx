import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ROUTES } from '@/shared/lib/constants'
import { MainLayout } from '@/app/layouts/MainLayout'
import { PrivateRoute } from '@/features/auth/ui/PrivateRoute'

const CatalogPage = lazy(() => import('@/pages/CatalogPage'))
const SkillPage = lazy(() => import('@/pages/SkillPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const CreateSkillPage = lazy(() => import('@/pages/CreateSkillPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'))

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Загрузка...</div>}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<CatalogPage />} />
            <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />

            <Route element={<PrivateRoute />}>
              <Route path={ROUTES.SKILL} element={<SkillPage />} />
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
              <Route path={ROUTES.CREATE} element={<CreateSkillPage />} />
            </Route>

            <Route path={ROUTES.SERVER_ERROR} element={<ServerErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}