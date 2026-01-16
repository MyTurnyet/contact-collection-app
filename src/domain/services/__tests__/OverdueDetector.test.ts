import { describe, it, expect } from 'vitest'
import { isOverdue } from '../OverdueDetector'

describe('OverdueDetector', () => {
  describe('isOverdue', () => {
    it('should return true when scheduled date is in the past', () => {
      const scheduledDate = new Date(2024, 0, 15)
      const currentDate = new Date(2024, 0, 20)

      expect(isOverdue(scheduledDate, currentDate)).toBe(true)
    })

    it('should return false when scheduled date is in the future', () => {
      const scheduledDate = new Date(2024, 0, 25)
      const currentDate = new Date(2024, 0, 20)

      expect(isOverdue(scheduledDate, currentDate)).toBe(false)
    })

    it('should return false when scheduled date is today', () => {
      const scheduledDate = new Date(2024, 0, 20)
      const currentDate = new Date(2024, 0, 20)

      expect(isOverdue(scheduledDate, currentDate)).toBe(false)
    })

    it('should ignore time of day when comparing dates', () => {
      const scheduledDate = new Date(2024, 0, 20, 8, 0, 0)
      const currentDate = new Date(2024, 0, 20, 23, 59, 59)

      expect(isOverdue(scheduledDate, currentDate)).toBe(false)
    })

    it('should return true for yesterday', () => {
      const scheduledDate = new Date(2024, 0, 19)
      const currentDate = new Date(2024, 0, 20)

      expect(isOverdue(scheduledDate, currentDate)).toBe(true)
    })

    it('should return false for tomorrow', () => {
      const scheduledDate = new Date(2024, 0, 21)
      const currentDate = new Date(2024, 0, 20)

      expect(isOverdue(scheduledDate, currentDate)).toBe(false)
    })

    it('should handle dates across month boundaries', () => {
      const scheduledDate = new Date(2024, 0, 31)
      const currentDate = new Date(2024, 1, 1)

      expect(isOverdue(scheduledDate, currentDate)).toBe(true)
    })

    it('should handle dates across year boundaries', () => {
      const scheduledDate = new Date(2023, 11, 31)
      const currentDate = new Date(2024, 0, 1)

      expect(isOverdue(scheduledDate, currentDate)).toBe(true)
    })

    it('should return true for dates many days in the past', () => {
      const scheduledDate = new Date(2024, 0, 1)
      const currentDate = new Date(2024, 0, 31)

      expect(isOverdue(scheduledDate, currentDate)).toBe(true)
    })
  })
})
