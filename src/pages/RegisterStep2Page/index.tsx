import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { Logotype } from '@/shared/ui/Logo/Logotype'
import { CloseButton } from '@/shared/ui/CloseButton'
import { TabStepper } from '@/shared/ui/TabStepper'
import { Input } from '@/shared/ui/Input/Input'
import { DateInput } from '@/shared/ui/Input/DateInput/DateInput'
import { ImageInput } from '@/shared/ui/Input/ImageInput/ImageInput'
import { Select } from '@/shared/ui/Select/Select'
import { AvatarUploader } from '@/shared/ui/DownloadAvatar/AvatarUploader'
import { Button } from '@/shared/ui/Button'
import AddIcon from '@/shared/assets/icons/Add.svg?react'
import userSpeech from '@/shared/assets/images/UserSpeech.svg'
import styles from './RegisterStep2Page.module.css'
import { MultiSelect } from '@/shared/ui/MultiSelect'

const GENDER_OPTIONS = [
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

// Заглушки: реальные данные подключим вместе с логикой регистрации
const CITY_OPTIONS = [
  { value: 'moscow', label: 'Москва' },
  { value: 'spb', label: 'Санкт-Петербург' },
  { value: 'kazan', label: 'Казань' },
]

const CATEGORY_OPTIONS = [
  { id: 'health', label: 'Здоровье и лайфстайл' },
  { id: 'languages', label: 'Иностранные языки' },
]

const SUBCATEGORY_OPTIONS = [
  { id: 'yoga', label: 'Йога и медитация' },
  { id: 'english', label: 'Английский язык' },
]

export default function RegisterStep2Page() {
  const navigate = useNavigate()
  const location = useLocation()
  const [avatarUrl, setAvatarUrl] = useState('')
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState<string[]>([])
  const [subcategory, setSubcategory] = useState<string[]>([])

  // «Закрыть» и «Назад» возвращают на предыдущий роут (шаг 1)
  const handleBack = () => {
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate(ROUTES.REGISTER_STEP_1)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate(ROUTES.REGISTER_STEP_3)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Logotype onClick={() => navigate(ROUTES.HOME)} />
        <CloseButton onClick={handleBack} />
      </header>

      <div className={styles.stepper}>
        <TabStepper total={3} current={2} />
      </div>

      <main className={styles.content}>
        <section className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.avatar}>
              <AvatarUploader
                size={52}
                url={avatarUrl || undefined}
                buttonIcon={<AddIcon />}
                inputComponent={
                  <ImageInput
                    value={avatarUrl}
                    onChange={() => {}}
                    onSave={(value) => setAvatarUrl(value ?? '')}
                    onRemove={() => setAvatarUrl('')}
                  />
                }
              />
            </div>

            <div className={styles.fields}>
              <Input
                label="Имя"
                placeholder="Введите ваше имя"
                value={name}
                onChange={setName}
                containerClassName={styles.nameField}
              />

              <div className={styles.row}>
                <DateInput value={birthDate} onChange={setBirthDate} />
                <Select
                  className={styles.select}
                  label="Пол"
                  options={GENDER_OPTIONS}
                  value={gender}
                  onChange={setGender}
                />
              </div>

              <Select
                className={styles.select}
                label="Город"
                options={CITY_OPTIONS}
                value={city}
                onChange={setCity}
              />
              <MultiSelect
                className={styles.select}
                label="Категория навыка, которому хотите научиться"
                placeholder="Выберите категорию"
                options={CATEGORY_OPTIONS}
                selectedIds={category}
                onChange={setCategory}
              />
              <MultiSelect
                className={styles.select}
                label="Подкатегория навыка, которому хотите научиться"
                placeholder="Выберите подкатегорию"
                options={SUBCATEGORY_OPTIONS}
                selectedIds={subcategory}
                onChange={setSubcategory}
              />
            </div>

            <div className={styles.actions}>
              <Button
                type="button"
                variant="secondary"
                className={styles.action}
                onClick={handleBack}
              >
                Назад
              </Button>
              <Button type="submit" className={styles.action}>
                Продолжить
              </Button>
            </div>
          </form>
        </section>

        <section className={`${styles.card} ${styles.welcome}`}>
          <img src={userSpeech} alt="" className={styles.illustration} />
          <div className={styles.text}>
            <h1 className={styles.title}>Расскажите немного о себе</h1>
            <p className={styles.description}>
              Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
