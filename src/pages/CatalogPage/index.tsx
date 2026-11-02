// TODO: реализовать страницу CatalogPage
import LikeIcon from '@/shared/assets/icons/Like.svg?react';
import { Header } from '@/widgets/Header'
import styles from './CatalogPage.module.css'

export default function CatalogPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main>
        <h1>CatalogPage</h1>
        <p>Страница в разработке</p>
        <LikeIcon style={{ color: '#253017' }}/>
      </main>
    </div>
  )
}
