import { describe, it, expect } from 'vitest'
import {
  createScheduledDate,
  scheduledDateEquals,
  createNullScheduledDate,
  isNullScheduledDate,
} from '../ScheduledDate'

describe('ScheduledDate', () => {
  describe('createScheduledDate', () => {
    it('should create a scheduled date from a Date object', () => {
      const date = new Date('2024-12-25')

      const scheduledDate = createScheduledDate(date)

      expect(scheduledDate).toBeDefined()
      expect(scheduledDate.getTime()).toBe(date.getTime())
    })

    it('should throw error for invalid date', () => {
      const invalidDate = new Date('invalid')

      expect(() => createScheduledDate(invalidDate)).toThrow('Invalid date')
    })

    it('should allow past dates', () => {
      const pastDate = new Date('2020-01-01')

      const scheduledDate = createScheduledDate(pastDate)

      expect(scheduledDate.getTime()).toBe(pastDate.getTime())
    })

    it('should allow future dates', () => {
      const futureDate = new Date('2030-01-01')

      const scheduledDate = createScheduledDate(futureDate)

      expect(scheduledDate.getTime()).toBe(futureDate.getTime())
    })
  })

  describe('scheduledDateEquals', () => {
    it('should return true for same dates', () => {
      const date = new Date('2024-12-25')
      const scheduled1 = createScheduledDate(date)
      const scheduled2 = createScheduledDate(new Date('2024-12-25'))

      expect(scheduledDateEquals(scheduled1, scheduled2)).toBe(true)
    })

    it('should return false for different dates', () => {
      const scheduled1 = createScheduledDate(new Date('2024-12-25'))
      const scheduled2 = createScheduledDate(new Date('2024-12-26'))

      expect(scheduledDateEquals(scheduled1, scheduled2)).toBe(false)
    })
  })

  describe('null object pattern', () => {
    it('should create null scheduled date', () => {
      const nullDate = createNullScheduledDate()

      expect(nullDate).toBeDefined()
    })

    it('should identify null scheduled date', () => {
      const nullDate = createNullScheduledDate()

      expect(isNullScheduledDate(nullDate)).toBe(true)
    })

    it('should not identify regular date as null', () => {
      const regularDate = createScheduledDate(new Date('2024-12-25'))

      expect(isNullScheduledDate(regularDate)).toBe(false)
    })

    it('should always return same null instance', () => {
      const null1 = createNullScheduledDate()
      const null2 = createNullScheduledDate()

      expect(null1).toBe(null2)
    })
  })
})
