import { describe, it, expect } from 'vitest'
import { MAX_IMAGES, validateImage } from './images'

const makeFile = (type: string, sizeMb: number) => {
  const file = new File(['x'], 'photo', { type })
  Object.defineProperty(file, 'size', { value: sizeMb * 1024 * 1024 })
  return file
}

describe('validateImage', () => {
  it('пропускает подходящую картинку', () => {
    expect(validateImage(makeFile('image/png', 0.5), 0)).toBeNull()
  })

  it('не даёт загрузить больше 10 изображений', () => {
    expect(validateImage(makeFile('image/png', 0.5), MAX_IMAGES)).toMatch('не больше 10')
  })

  it('не пропускает другие форматы', () => {
    expect(validateImage(makeFile('application/pdf', 0.5), 0)).toMatch('JPG, PNG или WebP')
    expect(validateImage(makeFile('image/gif', 0.5), 0)).toMatch('JPG, PNG или WebP')
  })

  it('не пропускает слишком тяжёлые файлы', () => {
    expect(validateImage(makeFile('image/jpeg', 2), 0)).toMatch('не больше 1 МБ')
  })
})
