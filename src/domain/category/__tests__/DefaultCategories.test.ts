import { describe, it, expect } from 'vitest'
import { createDefaultCategories } from '../DefaultCategories'

describe('DefaultCategories', () => {
  describe('createDefaultCategories', () => {
    it('should create a list of default categories', () => {
      const categories = createDefaultCategories()

      expect(categories).toBeDefined()
      expect(categories.length).toBeGreaterThan(0)
    })

    it('should create categories with unique IDs', () => {
      const categories = createDefaultCategories()

      const ids = categories.map((c) => c.id)
      const uniqueIds = new Set(ids)

      expect(uniqueIds.size).toBe(categories.length)
    })

    it('should create categories with valid names', () => {
      const categories = createDefaultCategories()

      categories.forEach((category) => {
        expect(category.name).toBeDefined()
        expect(typeof category.name).toBe('string')
      })
    })

    it('should create categories with valid frequencies', () => {
      const categories = createDefaultCategories()

      categories.forEach((category) => {
        expect(category.frequency).toBeDefined()
        expect(category.frequency.value).toBeGreaterThan(0)
        expect(['days', 'weeks', 'months']).toContain(
          category.frequency.unit
        )
      })
    })

    it('should include Family category', () => {
      const categories = createDefaultCategories()

      const hasFamily = categories.some((c) => c.name === 'Family')

      expect(hasFamily).toBe(true)
    })

    it('should include Close Friends category', () => {
      const categories = createDefaultCategories()

      const hasCloseFriends = categories.some((c) => c.name === 'Close Friends')

      expect(hasCloseFriends).toBe(true)
    })

    it('should include Friends category', () => {
      const categories = createDefaultCategories()

      const hasFriends = categories.some((c) => c.name === 'Friends')

      expect(hasFriends).toBe(true)
    })

    it('should include Colleagues category', () => {
      const categories = createDefaultCategories()

      const hasColleagues = categories.some((c) => c.name === 'Colleagues')

      expect(hasColleagues).toBe(true)
    })

    it('should include Acquaintances category', () => {
      const categories = createDefaultCategories()

      const hasAcquaintances = categories.some(
        (c) => c.name === 'Acquaintances'
      )

      expect(hasAcquaintances).toBe(true)
    })
  })
})
