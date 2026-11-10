import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { setSearchQuery, selectFilter } from '@/features/catalog-filter/model/filterSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import styles from './MainLayout.module.css'

const links = {
  skills: 'skills',
}

export function MainLayout() {
  const dispatch = useAppDispatch()
  const searchQuery = useAppSelector((state) => selectFilter(state).searchQuery)

  return (
    <div className={styles.layout}>
      <Header
        searchValue={searchQuery}
        onSearchChange={(query) => dispatch(setSearchQuery(query))}
        onSearch={(query) => dispatch(setSearchQuery(query))}
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
