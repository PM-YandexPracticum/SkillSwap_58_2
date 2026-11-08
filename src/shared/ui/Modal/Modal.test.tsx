import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

describe('Modal', () => {
  afterEach(() => {
    document.body.removeAttribute('style')
  })

  it('не показывает ничего, пока закрыто', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>Содержимое</p>
      </Modal>,
    )
    expect(screen.queryByText('Содержимое')).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('показывает переданное содержимое в диалоге прямо в body', () => {
    const { container } = render(
      <Modal isOpen onClose={vi.fn()} label="Ваше предложение">
        <p>Содержимое</p>
      </Modal>,
    )
    const dialog = screen.getByRole('dialog', { name: 'Ваше предложение' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Содержимое')).toBeInTheDocument()
    expect(document.body).toContainElement(dialog)
    expect(container).not.toContainElement(dialog)
  })

  it('закрывается по Esc', async () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose}>
        <button>Кнопка</button>
      </Modal>,
    )
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('не реагирует на Esc, пока закрыто', async () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={false} onClose={onClose}>
        <p>Содержимое</p>
      </Modal>,
    )
    await userEvent.keyboard('{Escape}')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('закрывается по клику на фон, но не по клику внутри окна', async () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose}>
        <p>Содержимое</p>
      </Modal>,
    )

    await userEvent.click(screen.getByText('Содержимое'))
    expect(onClose).not.toHaveBeenCalled()

    await userEvent.click(screen.getByTestId('modal-backdrop'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('не закрывается, если нажатие началось в окне, а отпущено на фоне', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose}>
        <p>Содержимое</p>
      </Modal>,
    )
    const backdrop = screen.getByTestId('modal-backdrop')

    fireEvent.mouseDown(screen.getByText('Содержимое'))
    fireEvent.click(backdrop)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('блокирует прокрутку страницы, пока открыто, и возвращает после закрытия', () => {
    document.body.style.overflow = 'scroll'
    const { rerender } = render(
      <Modal isOpen onClose={vi.fn()}>
        <p>Содержимое</p>
      </Modal>,
    )
    expect(document.body.style.overflow).toBe('hidden')

    rerender(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>Содержимое</p>
      </Modal>,
    )
    expect(document.body.style.overflow).toBe('scroll')
  })

  it('возвращает прокрутку при удалении окна из дерева', () => {
    const { unmount } = render(
      <Modal isOpen onClose={vi.fn()}>
        <p>Содержимое</p>
      </Modal>,
    )
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('переводит фокус в окно при открытии и возвращает его после закрытия', () => {
    const { rerender } = render(
      <>
        <button>Открыть</button>
        <Modal isOpen={false} onClose={vi.fn()}>
          <button>Внутри</button>
        </Modal>
      </>,
    )
    const opener = screen.getByRole('button', { name: 'Открыть' })
    opener.focus()

    rerender(
      <>
        <button>Открыть</button>
        <Modal isOpen onClose={vi.fn()}>
          <button>Внутри</button>
        </Modal>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Внутри' })).toHaveFocus()

    rerender(
      <>
        <button>Открыть</button>
        <Modal isOpen={false} onClose={vi.fn()}>
          <button>Внутри</button>
        </Modal>
      </>,
    )
    expect(opener).toHaveFocus()
  })

  it('удерживает фокус внутри окна при Tab и Shift+Tab', async () => {
    render(
      <>
        <button>Снаружи</button>
        <Modal isOpen onClose={vi.fn()}>
          <button>Первая</button>
          <button>Вторая</button>
        </Modal>
      </>,
    )
    const first = screen.getByRole('button', { name: 'Первая' })
    const second = screen.getByRole('button', { name: 'Вторая' })
    expect(first).toHaveFocus()

    await userEvent.tab()
    expect(second).toHaveFocus()

    await userEvent.tab()
    expect(first).toHaveFocus()

    await userEvent.tab({ shift: true })
    expect(second).toHaveFocus()
  })

  it('оставляет фокус на окне, если в нём нет кнопок и полей', async () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <p>Только текст</p>
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveFocus()

    await userEvent.tab()
    expect(dialog).toHaveFocus()
  })
})
