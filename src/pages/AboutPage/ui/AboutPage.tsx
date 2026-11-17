import { useEffect, useState } from 'react'
import { TeamMemberCard } from '@/entities/team-member'
import type { TeamMember } from '@/entities/team-member'
import { fetchMockData } from '@/api/fetchMockData'
import { LoadError } from '@/shared/ui/LoadError/LoadError'
import styles from './AboutPage.module.css'

export function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const message = 'Не удалось загрузить информацию о команде'
    fetchMockData<TeamMember[]>('team.json', message)
      .then((members) => {
        if (active) setTeam(members)
      })
      .catch(() => {
        if (active) setError(message)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Команда разработчиков SkillSwap</h1>
      {error && <LoadError message={error} />}
      <div className={styles.grid}>
        {team.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  )
}