// TODO: реализовать страницу CatalogPage
import { useEffect } from 'react'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { Sidebar } from '@/widgets/Sidebar'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  loadFilterOptions,
  selectCategoryOptions,
  selectCityOptions,
  selectFilterStatus,
} from '@/features/catalog-filter/model/filterSlice'
import styles from './CatalogPage.module.css'

export default function CatalogPage() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectCategoryOptions)
  const cities = useAppSelector(selectCityOptions)
  const status = useAppSelector(selectFilterStatus)

  useEffect(() => {
    if (status === 'idle') dispatch(loadFilterOptions())
  }, [dispatch, status])

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <div className={styles.layout}>
          {status === 'succeeded' && <Sidebar categories={categories} cities={cities} />}
          {status === 'failed' && <p>Не удалось загрузить фильтры</p>}
          <section className={styles.catalog}>
            <h1>CatalogPage</h1>
            <p>Страница в разработке</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}