import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { Logotype } from '@/shared/ui/Logo/Logotype'
import { CloseButton } from '@/shared/ui/CloseButton'
import { TabStepper } from '@/shared/ui/TabStepper'
import { Input } from '@/shared/ui/Input/Input'
import { Select } from '@/shared/ui/Select/Select'
import { Button } from '@/shared/ui/Button'
import { Textarea } from '@/shared/ui/Textarea/Textarea'
import { ImageUploader } from '@/shared/ui/DownloadImage/DownloadImage'
import { Modal } from '@/shared/ui/Modal'
import { Gallery } from '@/shared/ui/Gallery'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  loadFilterOptions,
  selectCategoryOptions,
  selectFilterStatus,
} from '@/features/catalog-filter/model/filterSlice'
import {
  completeRegistration,
  resetRegistration,
  SAVE_ERROR,
  saveRegistrationStep,
  selectRegistrationDraft,
} from '@/features/registration/model/registrationSlice'
import { getSubcategoriesOf } from '@/features/registration/lib/categories'
import {
  MAX_IMAGE_SIZE_MB,
  MAX_IMAGES,
  readFileAsDataUrl,
  validateImage,
} from '@/features/registration/lib/images'
import Pencil from '@/shared/assets/icons/Pencil.svg?react'
import schoolBoard from '@/shared/assets/images/SchoolBoard.svg'
import styles from './RegisterStep3Page.module.css'

export default function RegisterStep3Page() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const draft = useAppSelector(selectRegistrationDraft)
  const categories = useAppSelector(selectCategoryOptions)
  const filterStatus = useAppSelector(selectFilterStatus)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [skillName, setSkillName] = useState(draft.skillName)
  const [skillCategory, setSkillCategory] = useState(draft.skillCategory)
  const [skillSubcategory, setSkillSubcategory] = useState(draft.skillSubcategory)
  const [about, setAbout] = useState(draft.skillDescription)
  const [images, setImages] = useState<string[]>(draft.skillImages)
  const [imageError, setImageError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const isDoneRef = useRef(false)

  // Черновик сбрасываем, когда уже ушли со страницы, — иначе защита шагов
  // успеет перекинуть на шаг 1 раньше, чем откроется каталог
  useEffect(
    () => () => {
      if (isDoneRef.current) dispatch(resetRegistration())
    },
    [dispatch],
  )

  useEffect(() => {
    if (filterStatus === 'idle') dispatch(loadFilterOptions())
  }, [dispatch, filterStatus])

  const categoryOptions = useMemo(
    () => categories.map((item) => ({ value: item.category, label: item.category })),
    [categories],
  )
  // Подкатегории — только из выбранной категории
  const subcategoryOptions = useMemo(
    () =>
      getSubcategoriesOf(categories, skillCategory ? [skillCategory] : []).map((item) => ({
        value: item,
        label: item,
      })),
    [categories, skillCategory],
  )

  const handleCategoryChange = (value: string) => {
    setSkillCategory(value)
    // сменили категорию — старая подкатегория к ней уже не подходит
    setSkillSubcategory('')
  }

  const handleAddImage = async (file: File) => {
    const error = validateImage(file, images.length)
    if (error) {
      setImageError(error)
      return
    }
    setImageError(null)
    const url = await readFileAsDataUrl(file)
    setImages((prev) => [...prev, url])
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  }

  const errors = [
    !skillName.trim() && 'Введите название навыка',
    !skillCategory && 'Выберите категорию навыка',
    !skillSubcategory && 'Выберите подкатегорию навыка',
    !about.trim() && 'Опишите, чему можете научить',
    images.length === 0 && 'Добавьте хотя бы одно изображение',
  ].filter((error): error is string => Boolean(error))

  const handleBack = () => {
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate(ROUTES.REGISTER_STEP_2)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitted(true)
    if (errors.length > 0) return

    await dispatch(
      saveRegistrationStep({
        step: 3,
        data: {
          skillName: skillName.trim(),
          skillCategory,
          skillSubcategory,
          skillDescription: about.trim(),
          skillImages: images,
        },
      }),
    )
    setIsModalOpen(true)
  }

  // «Готово»: сохраняем пользователя, входим и идём в каталог
  const handleDone = async () => {
    setSaveError(null)
    const result = await dispatch(completeRegistration())
    if (completeRegistration.fulfilled.match(result)) {
      isDoneRef.current = true
      navigate(ROUTES.HOME, { replace: true })
    } else {
      setSaveError(result.payload ?? SAVE_ERROR)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Logotype onClick={() => navigate(ROUTES.HOME)} />
        <CloseButton onClick={handleBack} />
      </header>

      <div className={styles.stepper}>
        <TabStepper total={3} current={3} className={isModalOpen ? styles.colorStepper : ''} />
      </div>

      <main className={styles.content}>
        <section className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <Input
              containerClassName={styles.input}
              label="Название навыка"
              placeholder="Введите название вашего навыка"
              value={skillName}
              onChange={setSkillName}
            />
            <Select
              label="Категория навыка"
              placeholder="Выберите категорию навыка"
              options={categoryOptions}
              value={skillCategory}
              onChange={handleCategoryChange}
            />
            <Select
              label="Подкатегория навыка"
              placeholder={
                skillCategory ? 'Выберите подкатегорию навыка' : 'Сначала выберите категорию'
              }
              options={subcategoryOptions}
              value={skillSubcategory}
              onChange={setSkillSubcategory}
            />

            <Textarea
              label="Описание"
              value={about}
              onChange={(event) => setAbout(event.target.value)}
              placeholder="Коротко опишите, чему можете научить"
            />

            {images.length < MAX_IMAGES && (
              <ImageUploader key={images.length} onFileSelect={handleAddImage} />
            )}
            <p className={styles.imagesHint}>
              Загружено {images.length} из {MAX_IMAGES}. JPG, PNG или WebP, до {MAX_IMAGE_SIZE_MB}{' '}
              МБ каждое
            </p>
            {imageError && (
              <p className={styles.imageError} role="alert">
                {imageError}
              </p>
            )}
            {images.length > 0 && (
              <ul className={styles.images}>
                {images.map((src, index) => (
                  <li key={`${index}-${src.slice(-16)}`} className={styles.thumb}>
                    <img src={src} alt={`Изображение навыка ${index + 1}`} />
                    <button
                      type="button"
                      className={styles.thumbRemove}
                      onClick={() => handleRemoveImage(index)}
                      aria-label={`Удалить изображение ${index + 1}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {isSubmitted && errors.length > 0 && (
              <ul className={styles.errors} role="alert">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}

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
          <img src={schoolBoard} alt="" className={styles.illustration} />
          <div className={styles.text}>
            <h1 className={styles.title}>Укажите, чем вы готовы поделиться</h1>
            <p className={styles.description}>
              Так другие люди смогут увидеть ваши предложения и предложить вам обмен!
            </p>
          </div>
        </section>
        <Modal
          className={styles.modal}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
          }}
        >
          <div className={styles.headerModal}>
            <h2 className={styles.titleModal}>Ваше предложение</h2>
            <p className={styles.descriptionModal}>
              Пожалуйста, проверьте и подтвердите правильность данных
            </p>
          </div>
          <div className={styles.offer}>
            <div className={styles.textAndButtons}>
              <section className={styles.about}>
                <div className={styles.aboutHeader}>
                  <h3 className={styles.aboutTitle}>{skillName}</h3>
                  <div className={styles.categorySubcategory}>
                    {skillCategory} / {skillSubcategory}
                  </div>
                </div>
                <p>{about}</p>
              </section>
              <div className={styles.buttons}>
                <Button
                  className={styles.button}
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(false)
                  }}
                >
                  Редактировать <Pencil />
                </Button>
                <Button className={styles.button} onClick={handleDone}>
                  Готово
                </Button>
              </div>
              {saveError && (
                <p className={styles.imageError} role="alert">
                  {saveError}
                </p>
              )}
            </div>
            <Gallery
              images={images.map((src, index) => ({
                src,
                alt: `Изображение навыка ${index + 1}`,
              }))}
            />
          </div>
        </Modal>
      </main>
    </div>
  )
}