import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import styles from './MainLayout.module.css'

const links = {
  skills: 'skills',
}

export function MainLayout() {
  return (
    <div className={styles.layout}>
      <Header />      
      <Suspense fallback={<div>Загрузка...</div>}>
        <Outlet />
      </Suspense>
      <div className={styles.footer}>
        <Footer links={links} />
      </div>
    </div>
  )
}
