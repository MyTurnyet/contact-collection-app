import { describe, it, expect } from 'vitest'
import { createCategory, categoryEquals } from '../Category'
import { createCategoryId } from '../CategoryId'
import { createCategoryName } from '../CategoryName'
import { createCheckInFrequency } from '../CheckInFrequency'

describe('Category', () => {
  describe('createCategory', () => {
    it('should create Category with all required fields', () => {
      const category = createCategory({
        id: createCategoryId(),
        name: createCategoryName('Family'),
        frequency: createCheckInFrequency({ value: 7, unit: 'days' }),
      })

      expect(category).toBeDefined()
      expect(category.name).toBeDefined()
      expect(category.frequency).toBeDefined()
    })

    it('should create Category with weeks frequency', () => {
      const category = createCategory({
        id: createCategoryId(),
        name: createCategoryName('Friends'),
        frequency: createCheckInFrequency({ value: 2, unit: 'weeks' }),
      })

      expect(category.frequency.value).toBe(2)
      expect(category.frequency.unit).toBe('weeks')
    })

    it('should create Category with months frequency', () => {
      const category = createCategory({
        id: createCategoryId(),
        name: createCategoryName('Colleagues'),
        frequency: createCheckInFrequency({ value: 1, unit: 'months' }),
      })

      expect(category.frequency.value).toBe(1)
      expect(category.frequency.unit).toBe('months')
    })

    it('should create immutable Category', () => {
      const category = createCategory({
        id: createCategoryId(),
        name: createCategoryName('Family'),
        frequency: createCheckInFrequency({ value: 7, unit: 'days' }),
      })

      expect(() => {
        // @ts-expect-error - Testing immutability
        category.name = createCategoryName('Friends')
      }).toThrow()
    })
  })

  describe('categoryEquals', () => {
    it('should return true for same categories', () => {
      const id = createCategoryId()
      const name = createCategoryName('Family')
      const frequency = createCheckInFrequency({ value: 7, unit: 'days' })

      const category1 = createCategory({ id, name, frequency })
      const category2 = createCategory({ id, name, frequency })

      expect(categoryEquals(category1, category2)).toBe(true)
    })

    it('should return false for different category IDs', () => {
      const name = createCategoryName('Family')
      const frequency = createCheckInFrequency({ value: 7, unit: 'days' })

      const category1 = createCategory({
        id: createCategoryId(),
        name,
        frequency,
      })
      const category2 = createCategory({
        id: createCategoryId(),
        name,
        frequency,
      })

      expect(categoryEquals(category1, category2)).toBe(false)
    })

    it('should return false for different names', () => {
      const id = createCategoryId()
      const frequency = createCheckInFrequency({ value: 7, unit: 'days' })

      const category1 = createCategory({
        id,
        name: createCategoryName('Family'),
        frequency,
      })
      const category2 = createCategory({
        id,
        name: createCategoryName('Friends'),
        frequency,
      })

      expect(categoryEquals(category1, category2)).toBe(false)
    })

    it('should return false for different frequencies', () => {
      const id = createCategoryId()
      const name = createCategoryName('Family')

      const category1 = createCategory({
        id,
        name,
        frequency: createCheckInFrequency({ value: 7, unit: 'days' }),
      })
      const category2 = createCategory({
        id,
        name,
        frequency: createCheckInFrequency({ value: 14, unit: 'days' }),
      })

      expect(categoryEquals(category1, category2)).toBe(false)
    })
  })
})
