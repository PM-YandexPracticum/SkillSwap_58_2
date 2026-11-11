import { useEffect, useRef, useState } from 'react'
import { SkillsGrid } from '@/shared/ui/SkillsGrid/SkillsGrid'
import { useAppSelector } from '@/store/hooks'
import { createPortal } from 'react-dom'
import { selectSkillCategories } from '@/entities/skills/selectors/skillCategoriesSelectors'
import styles from './SkillsModal.module.css'


interface SkillsModalProps {
  isOpen: boolean
  onClose: () => void
  anchorRef?: React.RefObject<HTMLElement | null>
}

export const SkillsModal = ({ isOpen, onClose, anchorRef }: SkillsModalProps) => {
  const skills = useAppSelector(selectSkillCategories)
  const modalRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 })

  useEffect(() => {
    if (!isOpen || !anchorRef?.current) return

    const rect = anchorRef.current.getBoundingClientRect()
    setPosition({
      top: rect.bottom + window.scrollY + 8,
      left: 36,
      width: 1150,
    })
  }, [isOpen, anchorRef])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const clickedOnModal = modalRef.current?.contains(event.target as Node)
      const clickedOnAnchor = anchorRef?.current?.contains(event.target as Node)
      
      if (!clickedOnModal && !clickedOnAnchor) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, anchorRef])

  const categoryList = skills.map((skill) => ({
    color: skill.color,
    icon: <img src={`/db/${skill.icon}`} alt="" />,
    title: skill.category,
    items: skill.subcategories,
  }))

  if (!isOpen) return null

  const modalContent = (
    <div 
      ref={modalRef} 
      className={styles.modal} 
      role="listbox"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
      }}
    >
      <SkillsGrid categoryList={categoryList} />
    </div>
  )

  return createPortal(modalContent, document.body)
}