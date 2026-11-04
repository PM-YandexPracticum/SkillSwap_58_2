import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { RadioGroup } from '../../shared/ui/RadioGroup/RadioGroup'
import { Radio } from '../../shared/ui/RadioGroup/Radio'
import { CheckboxTree } from '../../shared/ui/CheckboxTree/CheckboxTree'
import type { TreeItem } from '../../shared/ui/CheckboxTree/types'
import type { SkillCategory } from '../../shared/types'
import {
  selectFilter,
  setSkillType,
  setSkills,
  setGender,
  setCities,
} from '../../features/catalog-filter/model/filterSlice'
import type { SkillTypeFilter, GenderFilter } from '../../features/catalog-filter/model/filterSlice'
import styles from './Sidebar.module.css'

export const CITIES = [
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
  'Краснодар',
  'Самара',
  'Ростов-на-Дону',
  'Уфа',
]

export interface SidebarProps {
  categories: SkillCategory[]
  cities?: string[]
  className?: string
}

export const Sidebar = ({ categories, cities = CITIES, className }: SidebarProps) => {
  const dispatch = useAppDispatch()
  const filter = useAppSelector(selectFilter)

  const skillItems = useMemo<TreeItem[]>(
    () =>
      categories.map((category) => ({
        id: `category-${category.id}`,
        label: category.category,
        children: category.subcategories.map((sub) => ({ id: sub, label: sub })),
      })),
    [categories],
  )

  const cityItems = useMemo<TreeItem[]>(
    () => cities.map((city) => ({ id: city, label: city })),
    [cities],
  )

  const sidebarClass = className ? `${styles.sidebar} ${className}` : styles.sidebar

  return (
    <aside className={sidebarClass}>
      <h2 className={styles.title}>Фильтры</h2>

      <div className={styles.filters}>
        <RadioGroup
          name="skill-type"
          value={filter.skillType}
          onChange={(value) => dispatch(setSkillType(value as SkillTypeFilter))}
        >
          <Radio value="all" label="Всё" />
          <Radio value="learn" label="Хочу научиться" />
          <Radio value="teach" label="Могу научить" />
        </RadioGroup>

        <CheckboxTree
          title="Навыки"
          items={skillItems}
          selectedIds={filter.skills}
          onChange={(ids) => dispatch(setSkills(ids))}
        />

        <RadioGroup
          name="gender"
          label="Пол автора"
          value={filter.gender}
          onChange={(value) => dispatch(setGender(value as GenderFilter))}
        >
          <Radio value="any" label="Не имеет значения" />
          <Radio value="male" label="Мужской" />
          <Radio value="female" label="Женский" />
        </RadioGroup>

        <CheckboxTree
          title="Город"
          items={cityItems}
          selectedIds={filter.cities}
          onChange={(ids) => dispatch(setCities(ids))}
          showAllLabel="Все города"
          hideLabel="Скрыть города"
        />
      </div>
    </aside>
  )
}
