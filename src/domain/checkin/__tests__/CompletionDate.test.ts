import { describe, it, expect } from 'vitest'
import {
  createCompletionDate,
  completionDateEquals,
  createNullCompletionDate,
  isNullCompletionDate,
} from '../CompletionDate'

describe('CompletionDate', () => {
  describe('createCompletionDate', () => {
    it('should create a completion date from a Date object', () => {
      const date = new Date('2024-12-25')

      const completionDate = createCompletionDate(date)

      expect(completionDate).toBeDefined()
      expect(completionDate.getTime()).toBe(date.getTime())
    })

    it('should throw error for invalid date', () => {
      const invalidDate = new Date('invalid')

      expect(() => createCompletionDate(invalidDate)).toThrow('Invalid date')
    })

    it('should allow past dates', () => {
      const pastDate = new Date('2020-01-01')

      const completionDate = createCompletionDate(pastDate)

      expect(completionDate.getTime()).toBe(pastDate.getTime())
    })

    it('should allow current date', () => {
      const now = new Date()

      const completionDate = createCompletionDate(now)

      expect(completionDate.getTime()).toBe(now.getTime())
    })
  })

  describe('completionDateEquals', () => {
    it('should return true for same dates', () => {
      const date = new Date('2024-12-25')
      const completion1 = createCompletionDate(date)
      const completion2 = createCompletionDate(new Date('2024-12-25'))

      expect(completionDateEquals(completion1, completion2)).toBe(true)
    })

    it('should return false for different dates', () => {
      const completion1 = createCompletionDate(new Date('2024-12-25'))
      const completion2 = createCompletionDate(new Date('2024-12-26'))

      expect(completionDateEquals(completion1, completion2)).toBe(false)
    })
  })

  describe('null object pattern', () => {
    it('should create null completion date', () => {
      const nullDate = createNullCompletionDate()

      expect(nullDate).toBeDefined()
    })

    it('should identify null completion date', () => {
      const nullDate = createNullCompletionDate()

      expect(isNullCompletionDate(nullDate)).toBe(true)
    })

    it('should not identify regular date as null', () => {
      const regularDate = createCompletionDate(new Date('2024-12-25'))

      expect(isNullCompletionDate(regularDate)).toBe(false)
    })

    it('should always return same null instance', () => {
      const null1 = createNullCompletionDate()
      const null2 = createNullCompletionDate()

      expect(null1).toBe(null2)
    })
  })
})
