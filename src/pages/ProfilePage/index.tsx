// TODO: реализовать страницу ProfilePage
import styles from './ProfilePage.module.css'
import { AvatarUploader } from '@/shared/ui/DownloadAvatar/AvatarUploader'
import { ImageUploader } from '@/shared/ui/DownloadImage/DownloadImage'
import GalleryEdit from '@/shared/assets/icons/GalleryEdit.svg?react'
import { Button } from '@/shared/ui/Button/Button'

import Envelope from '../../shared/assets/icons/Envelope.svg?react'
import Message from '../../shared/assets/icons/Message.svg?react'
import Like from '../../shared/assets/icons/Like.svg?react'
import Idea from '../../shared/assets/icons/Idea.svg?react'
import User from '../../shared/assets/icons/User.svg?react'
import { EmailInput } from '@/shared/ui/Input/EmailInput/EmailInput'
import { Input } from '@/shared/ui/Input/Input'
import { Select } from '@/shared/ui/Select/Select'
import { Textarea } from '@/shared/ui/Textarea/Textarea'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  loadFilterOptions,
  selectCityOptions,
  selectFilterStatus,
} from '@/features/catalog-filter/model/filterSlice'
import { DatePickerComponent } from '@/shared/ui/DatePicker/DatePicker'
import Pencil from '../../shared/assets/icons/Pencil.svg?react'
import { PasswordInput } from '@/shared/ui/Input/PasswordInput/PasswordInput'

const genderOptions = [
  { value: 'not_specified', label: 'Не указан' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

export default function ProfilePage() {
  const [gender, setGender] = useState('female')
  const [name, setName] = useState('Мария')
  const about = 'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем‑то интересным!'
  const [email, setEmail] = useState('Mariia@gmail.com')
  const [date, setDate] = useState('28.10.1995')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [isOpenPassword, setIsOpenPassword] = useState(false)
  const [isEmailInputDisabled, setIsEmailInputDisabled] = useState(true)
  const [isNameInputDisabled, setIsNameInputDisabled] = useState(true)
  const [isRepeatPasswordInputDisabled, setIsRepeatPasswordInputDisabled] = useState(true)
  const [isTextAreaDisabled, setIsTextAreaDisabled] = useState(true)
  const [isSavePasswordButtonDisabled, setIsSavePasswordButtonDisabled] = useState(true)
  const cities = useAppSelector(selectCityOptions).map((city) => {
    return {
      value: city.id.toString(),
      label: city.name,
    }
  })
  const [city, setCity] = useState('14')
  const [isCityChanged, setIsCityChanged] = useState(false)
  const filterStatus = useAppSelector(selectFilterStatus)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (filterStatus === 'idle') dispatch(loadFilterOptions())
  }, [dispatch, filterStatus])
  useEffect(() => {
    if (password) {
      setIsRepeatPasswordInputDisabled(false)
    }
    else {
      setIsRepeatPasswordInputDisabled(true)
      setRepeatPassword('')
    }
    if (password && repeatPassword && password==repeatPassword)
      setIsSavePasswordButtonDisabled(false)
  }, [password, repeatPassword])
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
          <li>
            <User />
            <span>Личные данные</span>
          </li>
        </ul>
        <div className={styles.userInfo}>
          <form className={styles.form}>
            <div className={styles.inputContainer}>
              <div className={styles.privateInfo}>
              <EmailInput
                label="Почта"
                value={email}
                onChange={(value) => {
                  setEmail(value)
                }}
                rightIcon={
                  <Pencil
                    onClick={() => {
                      setIsEmailInputDisabled(false)
                    }}
                    className={styles.inputIcon}
                  />
                }
                disabled={isEmailInputDisabled}
              />
              {!isOpenPassword ? (
                <span
                  onClick={() => {
                    if (!isOpenPassword) setIsOpenPassword(true)
                    else setIsOpenPassword(false)
                  }}
                  className={styles.passwordLink}
                >
                  Изменить пароль
                </span>
              ) : (
                <div className={styles.passwordContainer}>
                  <PasswordInput
                    label="Введите новый пароль"
                    value={password}
                    onChange={(value) => {
                      setPassword(value)
                    }}
                  />
                  <PasswordInput
                    label="Повторите новый пароль"
                    value={repeatPassword}
                    onChange={(value) => {
                      setRepeatPassword(value)
                    }}
                    disabled={isRepeatPasswordInputDisabled}
                  />
                </div>
              )}
              </div>
              <Input
                containerClassName={styles.nameInput}
                label="Имя"
                value={name}
                onChange={(value) => {
                  setName(value)
                }}
                rightIcon={
                  <Pencil
                    onClick={() => {
                      setIsNameInputDisabled(false)
                    }}
                    className={styles.inputIcon}
                  />
                }
                disabled={isNameInputDisabled}
                placeholder='Введите имя'
              />
              <div className={styles.rowInputs}>
                <DatePickerComponent value={date} onChange={(value) => {
                  setDate(value)
                }} />
                <Select
                  className={styles.selector}
                  label="Пол"
                  options={genderOptions}
                  value={gender}
                  onChange={(value) => {
                    setGender(value)
                  }}
                />
              </div>
              <Select
                className={styles.selector}
                label="Город"
                options={cities}
                value={city}
                onChange={(value) => {
                  setCity(value)
                  setIsCityChanged(true)
                }}
              />
              <Textarea
                label="О себе"
                value={about}
                rightIcon={
                  <Pencil
                    onClick={() => {
                      setIsTextAreaDisabled(false)
                    }}
                    className={styles.inputIcon}
                  />
                }
                disabled={isTextAreaDisabled}
              />
            </div>
            <Button
              className={styles.button}
              type="button"
              onClick={() => {
                setIsEmailInputDisabled(true)
                setIsNameInputDisabled(true)
                setIsTextAreaDisabled(true)
                setIsSavePasswordButtonDisabled(true)
                setIsOpenPassword(false)
                setIsCityChanged(false)
              }}
              disabled={!isCityChanged && isEmailInputDisabled && isNameInputDisabled && isTextAreaDisabled && isSavePasswordButtonDisabled}
            >
              Сохранить
            </Button>
          </form>
          <AvatarUploader
            className={styles.avatar}
            inputComponent={<ImageUploader />}
            buttonIcon={<GalleryEdit />}
          />
        </div>
      </div>
    </main>
  )
}
