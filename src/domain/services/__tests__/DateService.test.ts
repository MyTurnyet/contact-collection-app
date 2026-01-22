import { describe, it, expect } from 'vitest'
import {
  getStartOfDay,
  isDateBefore,
  areSameDay,
  isDateBetween,
  addDaysToDate,
} from '../DateService'

describe('DateService', () => {
  describe('getStartOfDay', () => {
    it('should return start of day with time set to 00:00:00.000', () => {
      const date = new Date('2024-01-15T14:30:45.123Z')
      const result = getStartOfDay(date)

      expect(result.getHours()).toBe(0)
      expect(result.getMinutes()).toBe(0)
      expect(result.getSeconds()).toBe(0)
      expect(result.getMilliseconds()).toBe(0)
    })

    it('should preserve the date when getting start of day', () => {
      const date = new Date('2024-01-15T14:30:45.123Z')
      const result = getStartOfDay(date)

      expect(result.getFullYear()).toBe(2024)
      expect(result.getMonth()).toBe(0) // January
      expect(result.getDate()).toBe(15)
    })
  })

  describe('isDateBefore', () => {
    it('should return true when date is before comparison date', () => {
      const earlier = new Date('2024-01-10')
      const later = new Date('2024-01-15')

      expect(isDateBefore(earlier, later)).toBe(true)
    })

    it('should return false when date is after comparison date', () => {
      const earlier = new Date('2024-01-10')
      const later = new Date('2024-01-15')

      expect(isDateBefore(later, earlier)).toBe(false)
    })

    it('should return false when dates are the same day', () => {
      const date1 = new Date('2024-01-15T09:00:00')
      const date2 = new Date('2024-01-15T18:00:00')

      expect(isDateBefore(date1, date2)).toBe(false)
    })

    it('should ignore time when comparing dates', () => {
      const morning = new Date('2024-01-15T09:00:00')
      const evening = new Date('2024-01-15T18:00:00')

      expect(isDateBefore(morning, evening)).toBe(false)
      expect(isDateBefore(evening, morning)).toBe(false)
    })
  })

  describe('areSameDay', () => {
    it('should return true for same day with different times', () => {
      const morning = new Date('2024-01-15T09:00:00')
      const evening = new Date('2024-01-15T18:00:00')

      expect(areSameDay(morning, evening)).toBe(true)
    })

    it('should return false for different days', () => {
      const day1 = new Date('2024-01-15')
      const day2 = new Date('2024-01-16')

      expect(areSameDay(day1, day2)).toBe(false)
    })

    it('should return true for exact same date and time', () => {
      const date = new Date('2024-01-15T12:00:00')

      expect(areSameDay(date, date)).toBe(true)
    })

    it('should ignore milliseconds when comparing', () => {
      const date1 = new Date('2024-01-15T12:00:00.000')
      const date2 = new Date('2024-01-15T12:00:00.999')

      expect(areSameDay(date1, date2)).toBe(true)
    })
  })

  describe('isDateBetween', () => {
    it('should return true when date is between start and end', () => {
      const start = new Date('2024-01-10')
      const middle = new Date('2024-01-15')
      const end = new Date('2024-01-20')

      expect(isDateBetween(middle, start, end)).toBe(true)
    })

    it('should return true when date equals start date', () => {
      const start = new Date('2024-01-10')
      const end = new Date('2024-01-20')

      expect(isDateBetween(start, start, end)).toBe(true)
    })

    it('should return true when date equals end date', () => {
      const start = new Date('2024-01-10')
      const end = new Date('2024-01-20')

      expect(isDateBetween(end, start, end)).toBe(true)
    })

    it('should return false when date is before start', () => {
      const before = new Date('2024-01-05')
      const start = new Date('2024-01-10')
      const end = new Date('2024-01-20')

      expect(isDateBetween(before, start, end)).toBe(false)
    })

    it('should return false when date is after end', () => {
      const start = new Date('2024-01-10')
      const end = new Date('2024-01-20')
      const after = new Date('2024-01-25')

      expect(isDateBetween(after, start, end)).toBe(false)
    })

    it('should ignore time components when checking range', () => {
      const start = new Date('2024-01-10T09:00:00')
      const middle = new Date('2024-01-15T18:00:00')
      const end = new Date('2024-01-20T12:00:00')

      expect(isDateBetween(middle, start, end)).toBe(true)
    })
  })

  describe('addDaysToDate', () => {
    it('should add positive days to date', () => {
      const date = new Date(2024, 0, 15)
      const result = addDaysToDate(date, 7)

      expect(result.getFullYear()).toBe(2024)
      expect(result.getMonth()).toBe(0) // January
      expect(result.getDate()).toBe(22)
    })

    it('should subtract days when given negative number', () => {
      const date = new Date(2024, 0, 15)
      const result = addDaysToDate(date, -7)

      expect(result.getFullYear()).toBe(2024)
      expect(result.getMonth()).toBe(0) // January
      expect(result.getDate()).toBe(8)
    })

    it('should handle month boundary correctly', () => {
      const date = new Date(2024, 0, 28)
      const result = addDaysToDate(date, 5)

      expect(result.getFullYear()).toBe(2024)
      expect(result.getMonth()).toBe(1) // February
      expect(result.getDate()).toBe(2)
    })

    it('should return same date when adding zero days', () => {
      const date = new Date('2024-01-15T12:00:00')
      const result = addDaysToDate(date, 0)

      expect(result.getTime()).toBe(date.getTime())
    })

    it('should preserve time when adding days', () => {
      const date = new Date('2024-01-15T14:30:45')
      const result = addDaysToDate(date, 3)

      expect(result.getHours()).toBe(14)
      expect(result.getMinutes()).toBe(30)
      expect(result.getSeconds()).toBe(45)
    })
  })
})
