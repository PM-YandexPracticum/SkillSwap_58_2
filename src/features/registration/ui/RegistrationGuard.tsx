import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { ROUTES } from '@/shared/lib/constants'
import { selectCompletedStep } from '../model/registrationSlice'

interface RegistrationGuardProps {
  /** Сколько шагов должно быть пройдено, чтобы открыть страницу */
  requiredStep: 1 | 2
}

/** Не пускает на шаги 2 и 3 по прямой ссылке, пока не пройдены предыдущие */
export function RegistrationGuard({ requiredStep }: RegistrationGuardProps) {
  const completedStep = useAppSelector(selectCompletedStep)

  if (completedStep < 1) return <Navigate to={ROUTES.REGISTER_STEP_1} replace />
  if (requiredStep === 2 && completedStep < 2) {
    return <Navigate to={ROUTES.REGISTER_STEP_2} replace />
  }
  return <Outlet />
}
