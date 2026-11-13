import { useEffect, useState } from 'react'
import { TeamMemberCard } from '@/entities/team-member'
import type { TeamMember } from '@/entities/team-member'
import styles from './AboutPage.module.css'

export function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/db/team.json')
      .then((res) => res.json())
      .then((data) => {
        setTeam(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Ошибка загрузки данных команды:', err)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Команда разработчиков SkillSwap</h1>
      <div className={styles.grid}>
        {team.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  )
}