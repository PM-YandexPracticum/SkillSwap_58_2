import type { SkillCardProps } from '@/widgets/SkillCard'
import { SkillLabel } from '@/shared/ui/SkillLabel/SkillLabel'
import { UserInfo } from '@/shared/ui/UserInfo/UserInfo'
import styles from './ProfileCard.module.css'

export interface ProfileCardProps extends Pick<
  SkillCardProps,
  'user' | 'canTeach' | 'wantToLearn'
> {
  bio: string
}

export function ProfileCard({ user, bio, canTeach, wantToLearn }: ProfileCardProps) {
  return (
    <aside className={styles.card}>
      <UserInfo {...user} showLikes={false} />

      {bio && <p className={styles.bio}>{bio}</p>}

      <section className={styles.section}>
        <h2 className={styles.title}>Может научить</h2>
        <div className={styles.tags}>
          <SkillLabel label={canTeach.label} color={canTeach.color} />
        </div>
      </section>

      {wantToLearn.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.title}>Хочет научиться</h2>
          <div className={styles.tags}>
            {wantToLearn.map((tag, index) => (
              <SkillLabel key={`${tag.label}-${index}`} label={tag.label} color={tag.color} />
            ))}
          </div>
        </section>
      )}
    </aside>
  )
}
