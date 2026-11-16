import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { Logotype } from '@/shared/ui/Logo/Logotype'
import { CloseButton } from '@/shared/ui/CloseButton'
import { TabStepper } from '@/shared/ui/TabStepper'
import { Input } from '@/shared/ui/Input/Input'
import { DatePickerComponent } from '@/shared/ui/DatePicker/DatePicker'
import { ImageInput } from '@/shared/ui/Input/ImageInput/ImageInput'
import { Select } from '@/shared/ui/Select/Select'
import { AvatarUploader } from '@/shared/ui/DownloadAvatar/AvatarUploader'
import { Button } from '@/shared/ui/Button'
import { MultiSelect } from '@/shared/ui/MultiSelect'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  loadFilterOptions,
  selectCategoryOptions,
  selectCityOptions,
  selectFilterStatus,
} from '@/features/catalog-filter/model/filterSlice'
import {
  saveRegistrationStep,
  selectRegistrationDraft,
} from '@/features/registration/model/registrationSlice'
import {
  getSubcategoriesOf,
  keepSubcategoriesOf,
} from '@/features/registration/lib/categories'
import AddIcon from '@/shared/assets/icons/Add.svg?react'
import userSpeech from '@/shared/assets/images/UserSpeech.svg'
import styles from './RegisterStep2Page.module.css'

const GENDER_OPTIONS = [
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

export default function RegisterStep2Page() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const draft = useAppSelector(selectRegistrationDraft)
  const categories = useAppSelector(selectCategoryOptions)
  const cities = useAppSelector(selectCityOptions)
  const filterStatus = useAppSelector(selectFilterStatus)

  const [avatarUrl, setAvatarUrl] = useState(draft.avatar)
  const [name, setName] = useState(draft.name)
  const [birthDate, setBirthDate] = useState(draft.birthDate)
  const [gender, setGender] = useState(draft.gender)
  const [city, setCity] = useState(draft.city)
  const [category, setCategory] = useState<string[]>(draft.learnCategories)
  const [subcategory, setSubcategory] = useState<string[]>(draft.learnSubcategories)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Категории и города — те же, что в фильтре каталога
  useEffect(() => {
    if (filterStatus === 'idle') dispatch(loadFilterOptions())
  }, [dispatch, filterStatus])

  const cityOptions = useMemo(
    () => cities.map((item) => ({ value: item.name, label: item.name })),
    [cities],
  )
  const categoryOptions = useMemo(
    () => categories.map((item) => ({ id: item.category, label: item.category })),
    [categories],
  )
  // Во втором списке — подкатегории только выбранных категорий
  const subcategoryOptions = useMemo(
    () => getSubcategoriesOf(categories, category).map((item) => ({ id: item, label: item })),
    [categories, category],
  )

  const handleCategoryChange = (next: string[]) => {
    setCategory(next)
    // сняли категорию — убираем и её подкатегории
    setSubcategory((prev) => keepSubcategoriesOf(categories, next, prev))
  }

  const errors = [
    !name.trim() && 'Введите имя',
    !birthDate && 'Укажите дату рождения',
    !gender && 'Выберите пол',
    !city && 'Выберите город',
    subcategory.length === 0 && 'Выберите хотя бы одну подкатегорию навыка',
  ].filter((error): error is string => Boolean(error))

  // «Закрыть» и «Назад» возвращают на предыдущий роут (шаг 1)
  const handleBack = () => {
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate(ROUTES.REGISTER_STEP_1)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitted(true)
    if (errors.length > 0) return

    await dispatch(
      saveRegistrationStep({
        step: 2,
        data: {
          avatar: avatarUrl,
          name: name.trim(),
          birthDate,
          gender,
          city,
          learnCategories: category,
          learnSubcategories: subcategory,
        },
      }),
    )
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
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
                <DatePickerComponent value={birthDate} onChange={setBirthDate} />
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
                placeholder="Выберите город"
                options={cityOptions}
                value={city}
                onChange={setCity}
              />
              <MultiSelect
                className={styles.select}
                label="Категория навыка, которому хотите научиться"
                placeholder="Выберите категорию"
                options={categoryOptions}
                selectedIds={category}
                onChange={handleCategoryChange}
              />
              <MultiSelect
                className={styles.select}
                label="Подкатегория навыка, которому хотите научиться"
                placeholder={category.length > 0 ? 'Выберите подкатегорию' : 'Сначала выберите категорию'}
                options={subcategoryOptions}
                selectedIds={subcategory}
                onChange={setSubcategory}
              />

              {isSubmitted && errors.length > 0 && (
                <ul className={styles.errors} role="alert">
                  {errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              )}
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