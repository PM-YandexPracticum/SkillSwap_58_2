import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ROUTES } from '@/shared/lib/constants'
import { MainLayout } from '@/app/layouts/MainLayout'
import { PrivateRoute } from '@/features/auth/ui/PrivateRoute'
import { RegistrationGuard } from '@/features/registration/ui/RegistrationGuard'

const CatalogPage = lazy(() => import('@/pages/CatalogPage'))
const SkillPage = lazy(() => import('@/pages/SkillPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const CreateSkillPage = lazy(() => import('@/pages/CreateSkillPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const RegisterStep2Page = lazy(() => import('@/pages/RegisterStep2Page'))
const RegisterStep3Page = lazy(() => import('@/pages/RegisterStep3Page'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const SkillsPage = lazy(() => import('@/pages/SkillsPage'))
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Загрузка...</div>}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<CatalogPage />} />
            <Route path={ROUTES.SKILLS} element={<SkillsPage />} />
            <Route path={ROUTES.ABOUT} element={<AboutPage />} />

            <Route element={<PrivateRoute />}>
              <Route path={ROUTES.SKILL} element={<SkillPage />} />
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
              <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />
              <Route path={ROUTES.CREATE} element={<CreateSkillPage />} />
            </Route>

            <Route path={ROUTES.SERVER_ERROR} element={<ServerErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route
            path={ROUTES.REGISTER}
            element={<Navigate to={ROUTES.REGISTER_STEP_1} replace />}
          />
          <Route path={ROUTES.REGISTER_STEP_1} element={<RegisterPage />} />
            <Route element={<RegistrationGuard requiredStep={1} />}>
            <Route path={ROUTES.REGISTER_STEP_2} element={<RegisterStep2Page />} />
          </Route>
            <Route element={<RegistrationGuard requiredStep={2} />}>
            <Route path={ROUTES.REGISTER_STEP_3} element={<RegisterStep3Page />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
