import { UserInfo } from '../../shared/ui/UserInfo/UserInfo'
import type { UserInfoProps } from '../../shared/ui/UserInfo/UserInfo'
import { SkillLabel } from '../../shared/ui/SkillLabel/SkillLabel'
import { Button } from '../../shared/ui/Button'
import styles from './SkillCard.module.css'

export interface SkillTag {
  label: string
  color?: string
}

export interface SkillCardProps {
  user: UserInfoProps
  canTeach: SkillTag
  wantToLearn: SkillTag[]
  maxVisibleTags?: number
  onDetailsClick?: () => void
  className?: string
}

const DEFAULT_TAG_COLOR = '#E7F2F6'

export const SkillCard = ({
  user,
  canTeach,
  wantToLearn,
  maxVisibleTags = 2,
  onDetailsClick,
  className,
}: SkillCardProps) => {
  const visibleTags = wantToLearn.slice(0, maxVisibleTags)
  const hiddenCount = wantToLearn.length - visibleTags.length
  const cardClass = className ? `${styles.card} ${className}` : styles.card

  return (
    <article className={cardClass}>
      <UserInfo {...user} />

      <div className={styles.content}>
        <div className={styles.sections}>
          <section className={styles.section}>
            <h3 className={styles.title}>Может научить:</h3>
            <div className={styles.tags}>
              <SkillLabel label={canTeach.label} color={canTeach.color ?? DEFAULT_TAG_COLOR} />
            </div>
          </section>

          {wantToLearn.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.title}>Хочет научиться:</h3>
              <div className={styles.tags}>
                {visibleTags.map((tag, index) => (
                  <SkillLabel
                    key={`${tag.label}-${index}`}
                    label={tag.label}
                    color={tag.color ?? DEFAULT_TAG_COLOR}
                  />
                ))}
                {hiddenCount > 0 && <SkillLabel count={hiddenCount} />}
              </div>
            </section>
          )}
        </div>

        <Button className={styles.button} onClick={onDetailsClick}>
          Подробнее
        </Button>
      </div>
    </article>
  )
}
