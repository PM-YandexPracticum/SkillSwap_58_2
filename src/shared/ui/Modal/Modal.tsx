import { useEffect, useRef } from 'react'
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  label?: string
  className?: string
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

let openModalsCount = 0
let savedOverflow = ''
let savedPaddingRight = ''

function lockScroll() {
  if (openModalsCount === 0) {
    const { body, documentElement } = document
    savedOverflow = body.style.overflow
    savedPaddingRight = body.style.paddingRight
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }
    body.style.overflow = 'hidden'
  }
  openModalsCount += 1
}

function unlockScroll() {
  openModalsCount = Math.max(0, openModalsCount - 1)
  if (openModalsCount === 0) {
    document.body.style.overflow = savedOverflow
    document.body.style.paddingRight = savedPaddingRight
  }
}

export function Modal({ isOpen, onClose, children, label, className }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const mouseDownOnBackdrop = useRef(false)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return

    lockScroll()
    return unlockScroll
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current
    const firstFocusable = dialog?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
    ;(firstFocusable ?? dialog)?.focus()

    return () => {
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return

    const dialog = dialogRef.current
    if (!dialog) return

    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    if (focusable.length === 0) {
      event.preventDefault()
      dialog.focus()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (event.shiftKey && (active === first || active === dialog)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    mouseDownOnBackdrop.current = event.target === event.currentTarget
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && mouseDownOnBackdrop.current) {
      onClose()
    }
    mouseDownOnBackdrop.current = false
  }

  const classNames = [styles.dialog, className].filter(Boolean).join(' ')

  return createPortal(
    <div
      className={styles.backdrop}
      onMouseDown={handleBackdropMouseDown}
      onClick={handleBackdropClick}
      data-testid="modal-backdrop"
    >
      <div
        ref={dialogRef}
        className={classNames}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onKeyDown={handleDialogKeyDown}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
