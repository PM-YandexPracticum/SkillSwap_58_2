import { Children, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import styles from './InfinityScrollSection.module.css'

export const LOAD_DELAY = 1000

export interface InfinityScrollSectionProps {
  title: ReactNode
  children: ReactNode
  hasMore: boolean
  onLoadMore: () => void
  headerAction?: ReactNode
  className?: string
}

export function InfinityScrollSection({
  title,
  children,
  hasMore,
  onLoadMore,
  headerAction,
  className,
}: InfinityScrollSectionProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onLoadMoreRef = useRef(onLoadMore)
  const [isLoading, setIsLoading] = useState(false)
  const itemsCount = Children.count(children)

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore
  }, [onLoadMore])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting || timerRef.current) return

      setIsLoading(true)
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        setIsLoading(false)
        onLoadMoreRef.current()
      }, LOAD_DELAY)
    })

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, itemsCount])

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  const classNames = [styles.section, className].filter(Boolean).join(' ')

  return (
    <section className={classNames}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {headerAction}
      </div>
      <div className={styles.grid}>{children}</div>
      {isLoading && <div className={styles.loader} role="status" aria-label="Загрузка" />}
      {hasMore && <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />}
    </section>
  )
}
