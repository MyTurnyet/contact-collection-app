import { describe, it, expect } from 'vitest'
import { createCategoryName, categoryNameEquals } from '../CategoryName'

describe('CategoryName', () => {
  describe('createCategoryName', () => {
    it('should create CategoryName from valid name', () => {
      const name = createCategoryName('Family')

      expect(name).toBeDefined()
      expect(typeof name).toBe('string')
    })

    it('should trim whitespace from name', () => {
      const name = createCategoryName('  Friends  ')

      expect(name).toBe('Friends')
    })

    it('should accept names with multiple words', () => {
      const name = createCategoryName('Close Friends')

      expect(name).toBe('Close Friends')
    })

    it('should accept names with special characters', () => {
      const name = createCategoryName('Co-workers')

      expect(name).toBe('Co-workers')
    })

    it('should throw error for empty string', () => {
      expect(() => createCategoryName('')).toThrow(
        'Category name cannot be empty'
      )
    })

    it('should throw error for whitespace only', () => {
      expect(() => createCategoryName('   ')).toThrow(
        'Category name cannot be empty'
      )
    })

    it('should throw error for names exceeding 50 characters', () => {
      const longName = 'a'.repeat(51)

      expect(() => createCategoryName(longName)).toThrow(
        'Category name must be 50 characters or less'
      )
    })

    it('should accept name with exactly 50 characters', () => {
      const name = 'a'.repeat(50)

      const categoryName = createCategoryName(name)

      expect(categoryName).toBe(name)
    })
  })

  describe('categoryNameEquals', () => {
    it('should return true for same names', () => {
      const name1 = createCategoryName('Family')
      const name2 = createCategoryName('Family')

      expect(categoryNameEquals(name1, name2)).toBe(true)
    })

    it('should return false for different names', () => {
      const name1 = createCategoryName('Family')
      const name2 = createCategoryName('Friends')

      expect(categoryNameEquals(name1, name2)).toBe(false)
    })
  })
})
