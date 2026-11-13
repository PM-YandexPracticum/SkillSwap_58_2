import BellIcon from '@/shared/assets/icons/BellLarge.svg?react'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import styles from './ExchangeModal.module.css'

export interface ExchangeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ExchangeModal({ isOpen, onClose }: ExchangeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} label="Вы предложили обмен">
      <div className={styles.content}>
        <BellIcon className={styles.icon} aria-hidden="true" />
        <div className={styles.text}>
          <h2 className={styles.title}>Вы предложили обмен</h2>
          <p className={styles.description}>
            Теперь дождитесь подтверждения. Вам придёт уведомление
          </p>
        </div>
        <Button className={styles.button} onClick={onClose}>
          Готово
        </Button>
      </div>
    </Modal>
  )
}
