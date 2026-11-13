import { Link } from 'react-router-dom'

import { Logotype } from '@/shared/ui/Logo/Logotype'

import styles from './Footer.module.css'


export type FooterLinkId = 'about' | 'skills' | 'contacts' | 'blog' | 'privacy' | 'terms'

export interface FooterProps {
  /** Пункты без адреса остаются текстом до появления соответствующих страниц. */
  links?: Partial<Record<FooterLinkId, string>>
  className?: string
}

const columns = [
  [
    { id: 'about', label: 'О проекте' },
    { id: 'skills', label: 'Все навыки' },
  ],
  [
    { id: 'contacts', label: 'Контакты' },
    { id: 'blog', label: 'Блог' },
  ],
  [
    { id: 'privacy', label: 'Политика конфиденциальности' },
    { id: 'terms', label: 'Пользовательское соглашение' },
  ],
] as const

export function Footer({ links, className }: FooterProps) {
  const classNames = [styles.footer, className].filter(Boolean).join(' ')

  return (
    <footer className={classNames}>
      <Logotype className={styles.logo} />

      <div className={styles.columns}>
        {columns.map((column) => (
          <ul key={column[0].id} className={styles.column}>
            {column.map(({ id, label }) => (
              <li key={id}>
                {links?.[id] ? (
                  <Link className={styles.link} to={links[id]}>
                    {label}
                  </Link>
                ) : (
                  <span>{label}</span>
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>

      <p className={styles.copyright}>SkillSwap — {new Date().getFullYear()}</p>
    </footer>
  )
}
