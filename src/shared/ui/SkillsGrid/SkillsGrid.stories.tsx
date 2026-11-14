import type { Meta, StoryObj } from '@storybook/react-vite'
import { SkillsGrid } from './SkillsGrid'
import Book from '../../../../public/db/images/icons/book.svg?react'
import Briefcase from '../../../../public/db/images/icons/briefcase.svg?react'
import Global from '../../../../public/db/images/icons/global.svg?react'
import Palette from '../../../../public/db/images/icons/palette.svg?react'
import Home from '../../../../public/db/images/icons/home.svg?react'
import Lifestyle from '../../../../public/db/images/icons/lifestyle.svg?react'
const mockSkills = [
  {
    title: "Бизнес и карьера",
    icon: <Briefcase />,
    color: '#EEE7F7',
    items: [
      "Управление командой",
      "Маркетинг и реклама",
      "Продажи и переговоры",
      "Личный бренд",
      "Резюме и собеседование",
      "Тайм-менеджмент",
      "Проектное управление",
      "Предпринимательство"
    ]
  },
  {
    title: "Иностранные языки",
    icon: <Global />,
    color: '#EBE5C5',
    items: [
      "Английский",
      "Французский",
      "Испанский",
      "Немецкий",
      "Китайский",
      "Японский",
      "Подготовка к экзаменам (IELTS, TOEFL)"
    ]
  },
  {
    title: "Дом и уют",
    icon: <Home />,
    color: '#F7EBE5',
    items: [
      "Уборка и организация",
      "Домашние финансы",
      "Приготовление еды",
      "Домашние растения",
      "Ремонт",
      "Хранение вещей"
    ]
  },
  {
    title: "Творчество и искусство",
    icon: <Palette />,
    color: '#F7E7F2',
    items: [
      "Рисование и иллюстрация",
      "Фотография",
      "Видеомонтаж",
      "Музыка и звук",
      "Актёрское мастерство",
      "Креативное письмо",
      "Арт-терапия",
      "Декор и DIY"
    ]
  },
  {
    title: "Образование и развитие",
    icon: <Book />,
    color: '#E7F2F6',
    items: [
      "Личностное развитие",
      "Навыки обучения",
      "Когнитивные техники",
      "Скорочтение",
      "Навыки преподавания",
      "Коучинг"
    ]
  },
  {
    title: "Здоровье и лайфстайл",
    icon: <Lifestyle />,
    color: '#E9F7E7',
    items: [
      "Йога и медитация",
      "Питание и ЗОЖ",
      "Ментальное здоровье",
      "Осознанность",
      "Физические тренировки",
      "Сон и восстановление",
      "Баланс жизни и работы"
    ]
  }
]


const meta: Meta<typeof SkillsGrid> = {
  title: 'Components/SkillsGrid',
  component: SkillsGrid,
  tags: ['autodocs'],
  args: {
    categoryList: mockSkills
  },
  decorators: [
    (Story) => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        width: '100%'
      }}>
        <div style={{ width: 1136 }}>
          <Story />
        </div>
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}