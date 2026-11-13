import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AvatarUploader } from '@/shared/ui/DownloadAvatar/AvatarUploader'
import { ImageUploader } from '@/shared/ui/DownloadImage/DownloadImage'
import GalleryEdit from '@/shared/assets/icons/GalleryEdit.svg?react'
import { Button } from '@/shared/ui/Button/Button'
import Envelope from '@/shared/assets/icons/Envelope.svg?react'
import Message from '@/shared/assets/icons/Message.svg?react'
import Like from '@/shared/assets/icons/Like.svg?react'
import Idea from '@/shared/assets/icons/Idea.svg?react'
import UserIcon from '@/shared/assets/icons/User.svg?react'
import Pencil from '@/shared/assets/icons/Pencil.svg?react'
import { EmailInput } from '@/shared/ui/Input/EmailInput/EmailInput'
import { Input } from '@/shared/ui/Input/Input'
import { Select } from '@/shared/ui/Select/Select'
import { Textarea } from '@/shared/ui/Textarea/Textarea'
import { DatePickerComponent } from '@/shared/ui/DatePicker/DatePicker'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  loadFilterOptions,
  selectCityOptions,
  selectFilterStatus,
} from '@/features/catalog-filter/model/filterSlice'
import { selectAuthStatus, selectAuthUser, updateAuthUser } from '@/features/auth/model/authSlice'
import type { AuthUser } from '@/shared/types'
import styles from './ProfilePage.module.css'

const genderOptions = [
  { value: 'not_specified', label: 'Не указан' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

interface ProfileForm {
  email: string
  name: string
  birthDate: string
  gender: NonNullable<AuthUser['gender']>
  city: string
  bio: string
  avatar: string
}

function formatBirthDate(value?: string): string {
  if (!value) return ''
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) return value

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  return match ? `${match[3]}.${match[2]}.${match[1]}` : ''
}

function storeBirthDate(value: string): string {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value)
  if (!match) return ''

  const [, day, month, year] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return ''
  }

  return `${year}-${month}-${day}`
}

function getProfileForm(user: AuthUser | null): ProfileForm {
  const gender =
    user?.gender === 'male' || user?.gender === 'female' ? user.gender : 'not_specified'

  return {
    email: user?.email ?? '',
    name: user?.name ?? '',
    birthDate: formatBirthDate(user?.birthDate),
    gender,
    city: user?.city ?? '',
    bio: user?.bio ?? '',
    avatar: user?.avatar ?? '',
  }
}

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectAuthUser)
  const authStatus = useAppSelector(selectAuthStatus)
  const cities = useAppSelector(selectCityOptions).map((city) => ({
    value: city.id,
    label: city.name,
  }))
  const filterStatus = useAppSelector(selectFilterStatus)
  const initialForm = getProfileForm(user)
  const [form, setForm] = useState(initialForm)
  const [avatarDraft, setAvatarDraft] = useState('')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isEmailInputDisabled, setIsEmailInputDisabled] = useState(true)
  const [isNameInputDisabled, setIsNameInputDisabled] = useState(true)
  const [isTextAreaDisabled, setIsTextAreaDisabled] = useState(true)

  useEffect(() => {
    if (filterStatus === 'idle') dispatch(loadFilterOptions())
  }, [dispatch, filterStatus])

  const isDirty =
    form.email !== initialForm.email ||
    form.name !== initialForm.name ||
    form.birthDate !== initialForm.birthDate ||
    form.gender !== initialForm.gender ||
    form.city !== initialForm.city ||
    form.bio !== initialForm.bio ||
    form.avatar !== initialForm.avatar
  const cityValue = cities.find((city) => city.label === form.city)?.value ?? ''

  const updateFormField = <Key extends keyof ProfileForm>(key: Key, value: ProfileForm[Key]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleAvatarFileSelect = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setAvatarDraft(reader.result)
    }
    reader.onerror = () => setSaveError('Не удалось загрузить изображение.')
    reader.readAsDataURL(file)
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaveError(null)

    try {
      const savedUser = await dispatch(
        updateAuthUser({
          email: form.email.trim(),
          name: form.name.trim(),
          birthDate: storeBirthDate(form.birthDate),
          gender: form.gender,
          city: form.city,
          bio: form.bio,
          avatar: form.avatar,
        }),
      ).unwrap()

      setForm(getProfileForm(savedUser))
      setAvatarDraft('')
      setIsEmailInputDisabled(true)
      setIsNameInputDisabled(true)
      setIsTextAreaDisabled(true)
    } catch {
      setSaveError('Не удалось сохранить изменения. Попробуйте ещё раз.')
    }
  }

  return (
    <main>
      <div className={styles.container}>
        <ul className={styles.sidebar}>
          <li>
            <Envelope />
            <span>Заявки</span>
          </li>
          <li>
            <Message />
            <span>Мои обмены</span>
          </li>
          <li>
            <Like className={styles.icon} />
            <span>Избранное</span>
          </li>
          <li>
            <Idea />
            <span>Мои навыки</span>
          </li>
          <li className={styles.active} aria-current="page">
            <UserIcon />
            <span>Личные данные</span>
          </li>
        </ul>

        <div className={styles.userInfo}>
          <form className={styles.form} onSubmit={handleSave}>
            <div className={styles.inputContainer}>
              <div className={styles.privateInfo}>
                <EmailInput
                  label="Почта"
                  value={form.email}
                  onChange={(value) => updateFormField('email', value)}
                  clear={false}
                  rightIcon={
                    <button
                      type="button"
                      className={styles.inputIcon}
                      aria-label="Изменить почту"
                      onClick={() => setIsEmailInputDisabled(false)}
                    >
                      <Pencil />
                    </button>
                  }
                  disabled={isEmailInputDisabled}
                />
              </div>

              <Input
                containerClassName={styles.nameInput}
                label="Имя"
                value={form.name}
                onChange={(value) => updateFormField('name', value)}
                rightIcon={
                  <button
                    type="button"
                    className={styles.inputIcon}
                    aria-label="Изменить имя"
                    onClick={() => setIsNameInputDisabled(false)}
                  >
                    <Pencil />
                  </button>
                }
                disabled={isNameInputDisabled}
                placeholder="Введите имя"
              />

              <div className={styles.rowInputs}>
                <DatePickerComponent
                  value={form.birthDate}
                  onChange={(value) => updateFormField('birthDate', value)}
                />
                <Select
                  className={styles.selector}
                  label="Пол"
                  options={genderOptions}
                  value={form.gender}
                  onChange={(value) => {
                    if (value === 'male' || value === 'female' || value === 'not_specified') {
                      updateFormField('gender', value)
                    }
                  }}
                />
              </div>

              <Select
                className={styles.selector}
                label="Город"
                options={cities}
                value={cityValue}
                onChange={(value) => {
                  const city = cities.find((option) => option.value === value)
                  if (city) updateFormField('city', city.label)
                }}
              />

              <Textarea
                label="О себе"
                value={form.bio}
                onChange={(event) => updateFormField('bio', event.target.value)}
                rightIcon={
                  <button
                    type="button"
                    className={styles.inputIcon}
                    aria-label="Изменить информацию о себе"
                    onClick={() => setIsTextAreaDisabled(false)}
                  >
                    <Pencil />
                  </button>
                }
                disabled={isTextAreaDisabled}
              />
            </div>

            {saveError && (
              <p className={styles.error} role="alert">
                {saveError}
              </p>
            )}

            <Button
              className={styles.button}
              type="submit"
              disabled={!isDirty || authStatus === 'loading'}
            >
              Сохранить
            </Button>
          </form>

          <AvatarUploader
            className={styles.avatar}
            url={avatarDraft || form.avatar}
            onChange={(avatar) => {
              updateFormField('avatar', avatar)
              setAvatarDraft('')
            }}
            inputComponent={
              <ImageUploader
                onFileSelect={handleAvatarFileSelect}
                onRemove={() => setAvatarDraft('')}
                placeholderText="Перетащите или выберите изображение"
                buttonText="Выбрать изображение"
              />
            }
            buttonIcon={<GalleryEdit />}
          />
        </div>
      </div>
    </main>
  )
}
