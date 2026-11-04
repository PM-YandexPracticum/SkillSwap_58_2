// TODO: реализовать страницу CatalogPage
import { useEffect, useState } from 'react'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { Sidebar } from '@/widgets/Sidebar'
import { fetchSkillCategories } from '@/api/skills'
import type { SkillCategory } from '@/shared/types'
import styles from './CatalogPage.module.css'

export default function CatalogPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([])

  useEffect(() => {
    fetchSkillCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <div className={styles.layout}>
          <Sidebar categories={categories} />
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