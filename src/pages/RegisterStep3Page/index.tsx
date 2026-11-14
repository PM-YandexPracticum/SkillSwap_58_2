import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { Logotype } from '@/shared/ui/Logo/Logotype'
import { CloseButton } from '@/shared/ui/CloseButton'
import { TabStepper } from '@/shared/ui/TabStepper'
import { Input } from '@/shared/ui/Input/Input'
import { Select } from '@/shared/ui/Select/Select'
import { Button } from '@/shared/ui/Button'
import schoolBoard from '@/shared/assets/images/SchoolBoard.svg'
import styles from './RegisterStep3Page.module.css'
import { Textarea } from '@/shared/ui/Textarea/Textarea'
import { ImageUploader } from '@/shared/ui/DownloadImage/DownloadImage'
import { Modal } from '@/shared/ui/Modal'
import { Gallery } from '@/shared/ui/Gallery'
import Pencil from '@/shared/assets/icons/Pencil.svg?react'
import photo1 from '../../shared/ui/Gallery/images/photo-1.svg'
import photo2 from '../../shared/ui/Gallery/images/photo-2.svg'
import photo3 from '../../shared/ui/Gallery/images/photo-3.svg'
import photo4 from '../../shared/ui/Gallery/images/photo-4.svg'
import photo5 from '../../shared/ui/Gallery/images/photo-5.svg'
import photo6 from '../../shared/ui/Gallery/images/photo-6.svg'

const categoryOptions = [{ value: '1', label: 'Творчество и искусство' }]

const subcategoryOptions = [
  { value: '1', label: 'Рисование и иллюстрация' },
  { value: '2', label: 'Фотография' },
  { value: '3', label: 'Видеомонтаж' },
  { value: '4', label: 'Музыка и звук' },
  { value: '5', label: 'Актёрское мастерство' },
  { value: '6', label: 'Креативное письмо' },
  { value: '7', label: 'Арт-терапия' },
  { value: '8', label: 'Декор и DIY' },
]

export default function RegisterStep3Page() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [skillName, setSkillName] = useState('Рисование акварелью')
  const [skillCategory, setSkillCategory] = useState('1')
  const [skillCategoryName, setSkillCategoryName] = useState<string | undefined>(
    'Творчество и искусство',
  )
  const [skillSubcategory, setSkillSubcategory] = useState('1')
  const [skillSubcategoryName, setSkillSubcategoryName] = useState<string | undefined>(
    'Рисование и иллюстрация',
  )
  const about =
    'Привет! Я рисую и занимаюсь творчеством уже больше 10 лет — от первых набросков в скетчбуках до профессиональных выставок и работы на заказ. Научу основам рисунка (и как не бояться чистого листа), владеть любимыми материалами, видеть пропорции.'
  const pictures = [photo1, photo2, photo3, photo4, photo5, photo6]

  const handleBack = () => {
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate(ROUTES.REGISTER_STEP_2)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsModalOpen(true)
  }

  const handleHome = () => {
    navigate(ROUTES.HOME)
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
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              containerClassName={styles.input}
              label="Название навыка"
              placeholder="Введите название вашего навыка"
              value={skillName}
              onChange={(value) => {
                setSkillName(value)
              }}
            />
            <Select
              label="Категория навыка"
              placeholder="Выберите категорию навыка"
              options={categoryOptions}
              value={skillCategory}
              onChange={(value) => {
                setSkillCategory(value)
                setSkillCategoryName(categoryOptions.find((category) => category.value == value )?.label)
              }}
            />
            <Select
              label="Подкатегория навыка"
              placeholder="Выберите подкатегорию навыка"
              options={subcategoryOptions}
              value={skillSubcategory}
              onChange={(value) => {
                setSkillSubcategory(value)
                setSkillSubcategoryName(subcategoryOptions.find((subcategory) => subcategory.value == value )?.label)
              }}
            />

            <Textarea
              label="Описание"
              value={about}
              placeholder="Коротко опишите, чему можете научить"
            />
            <ImageUploader />
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
                    {skillCategoryName} / {skillSubcategoryName}
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
                <Button className={styles.button} onClick={handleHome}>
                  Готово
                </Button>
              </div>
            </div>
            <Gallery
              images={pictures.map((src, index) => ({
                src,
                alt: `Пример фото ${index + 1}`,
              }))}
            />
          </div>
        </Modal>
      </main>
    </div>
  )
}
