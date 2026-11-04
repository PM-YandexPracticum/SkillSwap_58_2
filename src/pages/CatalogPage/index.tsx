// TODO: реализовать страницу CatalogPage
import LikeIcon from '@/shared/assets/icons/Like.svg?react'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import styles from './CatalogPage.module.css'

export default function CatalogPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <h1>CatalogPage</h1>
        <p>Страница в разработке</p>
        <LikeIcon style={{ color: '#253017' }} />
      </main>
      <Footer />
    </div>
  )
}
