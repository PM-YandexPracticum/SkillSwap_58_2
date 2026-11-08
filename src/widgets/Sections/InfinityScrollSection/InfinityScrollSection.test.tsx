import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InfinityScrollSection, LOAD_DELAY } from './InfinityScrollSection'

let observerCallback: IntersectionObserverCallback | null = null

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

const scrollToEnd = () =>
  act(() => {
    observerCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
  })

const renderSection = (hasMore = true, onLoadMore = vi.fn()) => {
  render(
    <InfinityScrollSection title="Рекомендуем" hasMore={hasMore} onLoadMore={onLoadMore}>
      <div>Карточка 1</div>
      <div>Карточка 2</div>
    </InfinityScrollSection>,
  )
  return onLoadMore
}

describe('InfinityScrollSection', () => {
  beforeEach(() => {
    observerCallback = null
    vi.useFakeTimers()
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('показывает заголовок и карточки', () => {
    renderSection()
    expect(screen.getByText('Рекомендуем')).toBeInTheDocument()
    expect(screen.getByText('Карточка 1')).toBeInTheDocument()
    expect(screen.getByText('Карточка 2')).toBeInTheDocument()
  })

  it('при скролле до конца показывает лоадер и подгружает через 1 секунду', () => {
    const onLoadMore = renderSection()
    scrollToEnd()

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(onLoadMore).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(LOAD_DELAY)
    })

    expect(onLoadMore).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('не вызывает подгрузку повторно, пока идёт ожидание', () => {
    const onLoadMore = renderSection()
    scrollToEnd()
    scrollToEnd()
    scrollToEnd()

    act(() => {
      vi.advanceTimersByTime(LOAD_DELAY)
    })

    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })

  it('не следит за скроллом, если карточек больше нет', () => {
    renderSection(false)
    expect(observerCallback).toBeNull()
  })
})
