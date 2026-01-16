import { describe, it, expect } from 'vitest'
import {
  createCategoryId,
  categoryIdFromString,
  categoryIdEquals,
} from '../CategoryId'

describe('CategoryId', () => {
  describe('createCategoryId', () => {
    it('should create a new CategoryId with a valid UUID', () => {
      const id = createCategoryId()

      expect(id).toBeDefined()
      expect(typeof id).toBe('string')
    })

    it('should create unique CategoryIds on each call', () => {
      const id1 = createCategoryId()
      const id2 = createCategoryId()

      expect(id1).not.toBe(id2)
    })
  })

  describe('categoryIdFromString', () => {
    it('should create CategoryId from valid UUID string', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000'

      const id = categoryIdFromString(uuid)

      expect(id).toBe(uuid)
    })

    it('should throw error for invalid UUID format', () => {
      const invalidUuid = 'not-a-uuid'

      expect(() => categoryIdFromString(invalidUuid)).toThrow(
        'Invalid CategoryId format'
      )
    })

    it('should throw error for empty string', () => {
      expect(() => categoryIdFromString('')).toThrow(
        'Invalid CategoryId format'
      )
    })
  })

  describe('categoryIdEquals', () => {
    it('should return true for same CategoryIds', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000'
      const id1 = categoryIdFromString(uuid)
      const id2 = categoryIdFromString(uuid)

      expect(categoryIdEquals(id1, id2)).toBe(true)
    })

    it('should return false for different CategoryIds', () => {
      const id1 = createCategoryId()
      const id2 = createCategoryId()

      expect(categoryIdEquals(id1, id2)).toBe(false)
    })
  })
})
