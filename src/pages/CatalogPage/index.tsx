import { useEffect } from 'react'
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
    <main>
      <div className={styles.layout}>
        {status === 'succeeded' && <Sidebar categories={categories} cities={cities} />}
        {status === 'failed' && <p>Не удалось загрузить фильтры</p>}
        <section className={styles.catalog}>
          <h1>CatalogPage</h1>
          <p>Страница в разработке</p>
        </section>
      </div>
    </main>
  )
}