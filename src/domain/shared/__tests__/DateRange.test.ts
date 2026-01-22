import { describe, it, expect } from 'vitest'
import { createDateRange, isDateInRange, dateRangeEquals } from '../DateRange'

describe('DateRange', () => {
  describe('createDateRange', () => {
    it('creates a date range with valid start and end dates', () => {
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 0, 31)

      const range = createDateRange(start, end)

      expect(range.start).toEqual(new Date(2024, 0, 1))
      expect(range.end).toEqual(new Date(2024, 0, 31))
    })

    it('normalizes dates to start of day', () => {
      const start = new Date(2024, 0, 1, 14, 30, 45)
      const end = new Date(2024, 0, 31, 9, 15, 20)

      const range = createDateRange(start, end)

      expect(range.start.getHours()).toBe(0)
      expect(range.start.getMinutes()).toBe(0)
      expect(range.start.getSeconds()).toBe(0)
      expect(range.end.getHours()).toBe(0)
      expect(range.end.getMinutes()).toBe(0)
      expect(range.end.getSeconds()).toBe(0)
    })

    it('allows start date equal to end date', () => {
      const sameDay = new Date(2024, 0, 15)

      const range = createDateRange(sameDay, sameDay)

      expect(range.start).toEqual(new Date(2024, 0, 15))
      expect(range.end).toEqual(new Date(2024, 0, 15))
    })

    it('throws error when start date is after end date', () => {
      const start = new Date(2024, 0, 31)
      const end = new Date(2024, 0, 1)

      expect(() => createDateRange(start, end)).toThrow(
        'DateRange start date must be before or equal to end date'
      )
    })

    it('creates immutable date range', () => {
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 0, 31)

      const range = createDateRange(start, end)

      expect(Object.isFrozen(range)).toBe(true)
    })
  })

  describe('isDateInRange', () => {
    it('returns true for date within range', () => {
      const range = createDateRange(new Date(2024, 0, 1), new Date(2024, 0, 31))
      const date = new Date(2024, 0, 15)

      expect(isDateInRange(date, range)).toBe(true)
    })

    it('returns true for date at start of range', () => {
      const range = createDateRange(new Date(2024, 0, 1), new Date(2024, 0, 31))
      const date = new Date(2024, 0, 1)

      expect(isDateInRange(date, range)).toBe(true)
    })

    it('returns true for date at end of range', () => {
      const range = createDateRange(new Date(2024, 0, 1), new Date(2024, 0, 31))
      const date = new Date(2024, 0, 31)

      expect(isDateInRange(date, range)).toBe(true)
    })

    it('returns false for date before range', () => {
      const range = createDateRange(new Date(2024, 0, 10), new Date(2024, 0, 20))
      const date = new Date(2024, 0, 5)

      expect(isDateInRange(date, range)).toBe(false)
    })

    it('returns false for date after range', () => {
      const range = createDateRange(new Date(2024, 0, 10), new Date(2024, 0, 20))
      const date = new Date(2024, 0, 25)

      expect(isDateInRange(date, range)).toBe(false)
    })

    it('normalizes date to start of day for comparison', () => {
      const range = createDateRange(new Date(2024, 0, 10), new Date(2024, 0, 20))
      const date = new Date(2024, 0, 15, 23, 59, 59)

      expect(isDateInRange(date, range)).toBe(true)
    })
  })

  describe('dateRangeEquals', () => {
    it('returns true for equal date ranges', () => {
      const range1 = createDateRange(new Date(2024, 0, 1), new Date(2024, 0, 31))
      const range2 = createDateRange(new Date(2024, 0, 1), new Date(2024, 0, 31))

      expect(dateRangeEquals(range1, range2)).toBe(true)
    })

    it('returns false for different start dates', () => {
      const range1 = createDateRange(new Date(2024, 0, 1), new Date(2024, 0, 31))
      const range2 = createDateRange(new Date(2024, 0, 2), new Date(2024, 0, 31))

      expect(dateRangeEquals(range1, range2)).toBe(false)
    })

    it('returns false for different end dates', () => {
      const range1 = createDateRange(new Date(2024, 0, 1), new Date(2024, 0, 31))
      const range2 = createDateRange(new Date(2024, 0, 1), new Date(2024, 0, 30))

      expect(dateRangeEquals(range1, range2)).toBe(false)
    })
  })
})
