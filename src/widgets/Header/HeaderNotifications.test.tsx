import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Header, type HeaderNotification } from './Header'

vi.mock('@/shared/assets/icons/ChevronDown.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Moon.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Sun.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Notification.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Like.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Logout.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/assets/icons/Idea.svg?react', () => ({ default: () => null }))
vi.mock('@/shared/ui/Logo/Logotype', () => ({ Logotype: () => <span>SkillSwap</span> }))
vi.mock('@/shared/ui/Input/SearchInput/SearchInput', () => ({
  SearchInput: () => <input aria-label="Поиск" />,
}))
vi.mock('@/shared/ui/SkillsModal/SkillsModal', () => ({ SkillsModal: () => null }))

const user = { name: 'Алексей' }
const fresh: HeaderNotification = {
  id: '1',
  text: 'Вы предложили обмен Иван',
  description: 'Теперь дождитесь подтверждения',
  createdAt: new Date().toISOString(),
  isRead: false,
}
const viewed: HeaderNotification = {
  id: '2',
  text: 'Вы предложили обмен Анна',
  createdAt: '2026-05-23T10:00:00.000Z',
  isRead: true,
}

function renderHeader(props: Partial<React.ComponentProps<typeof Header>> = {}) {
  return render(
    <MemoryRouter>
      <Header user={user} {...props} />
    </MemoryRouter>,
  )
}

describe('Header — уведомления', () => {
  it('показывает красную точку, если есть новые', () => {
    renderHeader({ notifications: [fresh] })

    expect(screen.getByTestId('notifications-badge')).toBeInTheDocument()
  })

  it('не показывает точку, если всё просмотрено', () => {
    renderHeader({ notifications: [viewed] })

    expect(screen.queryByTestId('notifications-badge')).not.toBeInTheDocument()
  })

  it('делит уведомления на новые и просмотренные, кнопки вызывают колбэки', async () => {
    const onReadAll = vi.fn()
    const onClear = vi.fn()
    renderHeader({
      notifications: [fresh, viewed],
      onReadAllNotifications: onReadAll,
      onClearNotifications: onClear,
    })

    await userEvent.click(screen.getByRole('button', { name: 'Уведомления, есть новые' }))

    expect(screen.getByRole('heading', { name: 'Новые уведомления' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Просмотренные' })).toBeInTheDocument()
    expect(screen.getByText('Вы предложили обмен Иван')).toBeInTheDocument()
    expect(screen.getByText('сегодня')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Прочитать все' }))
    await userEvent.click(screen.getByRole('button', { name: 'Очистить' }))
    expect(onReadAll).toHaveBeenCalledOnce()
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('при пустом списке пишет, что уведомлений нет', async () => {
    renderHeader({ notifications: [] })

    await userEvent.click(screen.getByRole('button', { name: 'Уведомления' }))

    expect(screen.getByText('Новых уведомлений нет')).toBeInTheDocument()
  })
})
