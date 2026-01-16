import { describe, it, expect } from 'vitest'
import { calculateNextCheckIn } from '../DateCalculator'
import { createCheckInFrequency } from '../../category/CheckInFrequency'

describe('DateCalculator', () => {
  describe('calculateNextCheckIn', () => {
    it('should add days to a date', () => {
      const baseDate = new Date(2024, 0, 15)
      const frequency = createCheckInFrequency({ value: 7, unit: 'days' })

      const nextDate = calculateNextCheckIn(baseDate, frequency)

      expect(nextDate.getFullYear()).toBe(2024)
      expect(nextDate.getMonth()).toBe(0)
      expect(nextDate.getDate()).toBe(22)
    })

    it('should add weeks to a date', () => {
      const baseDate = new Date(2024, 0, 15)
      const frequency = createCheckInFrequency({ value: 2, unit: 'weeks' })

      const nextDate = calculateNextCheckIn(baseDate, frequency)

      expect(nextDate.getFullYear()).toBe(2024)
      expect(nextDate.getMonth()).toBe(0)
      expect(nextDate.getDate()).toBe(29)
    })

    it('should add months to a date', () => {
      const baseDate = new Date(2024, 0, 15)
      const frequency = createCheckInFrequency({ value: 1, unit: 'months' })

      const nextDate = calculateNextCheckIn(baseDate, frequency)

      expect(nextDate.getFullYear()).toBe(2024)
      expect(nextDate.getMonth()).toBe(1)
      expect(nextDate.getDate()).toBe(15)
    })

    it('should handle adding multiple months', () => {
      const baseDate = new Date(2024, 0, 15)
      const frequency = createCheckInFrequency({ value: 3, unit: 'months' })

      const nextDate = calculateNextCheckIn(baseDate, frequency)

      expect(nextDate.getFullYear()).toBe(2024)
      expect(nextDate.getMonth()).toBe(3)
      expect(nextDate.getDate()).toBe(15)
    })

    it('should handle month overflow correctly', () => {
      const baseDate = new Date(2024, 0, 31)
      const frequency = createCheckInFrequency({ value: 1, unit: 'months' })

      const nextDate = calculateNextCheckIn(baseDate, frequency)

      expect(nextDate.getFullYear()).toBe(2024)
      expect(nextDate.getMonth()).toBe(1)
      expect(nextDate.getDate()).toBe(29)
    })

    it('should handle year boundary with days', () => {
      const baseDate = new Date(2024, 11, 28)
      const frequency = createCheckInFrequency({ value: 7, unit: 'days' })

      const nextDate = calculateNextCheckIn(baseDate, frequency)

      expect(nextDate.getFullYear()).toBe(2025)
      expect(nextDate.getMonth()).toBe(0)
      expect(nextDate.getDate()).toBe(4)
    })

    it('should handle year boundary with months', () => {
      const baseDate = new Date(2024, 10, 15)
      const frequency = createCheckInFrequency({ value: 2, unit: 'months' })

      const nextDate = calculateNextCheckIn(baseDate, frequency)

      expect(nextDate.getFullYear()).toBe(2025)
      expect(nextDate.getMonth()).toBe(0)
      expect(nextDate.getDate()).toBe(15)
    })

    it('should preserve time of day', () => {
      const baseDate = new Date(2024, 0, 15, 14, 30, 0)
      const frequency = createCheckInFrequency({ value: 1, unit: 'days' })

      const nextDate = calculateNextCheckIn(baseDate, frequency)

      expect(nextDate.getHours()).toBe(14)
      expect(nextDate.getMinutes()).toBe(30)
    })

    it('should handle single day frequency', () => {
      const baseDate = new Date(2024, 0, 15)
      const frequency = createCheckInFrequency({ value: 1, unit: 'days' })

      const nextDate = calculateNextCheckIn(baseDate, frequency)

      expect(nextDate.getFullYear()).toBe(2024)
      expect(nextDate.getMonth()).toBe(0)
      expect(nextDate.getDate()).toBe(16)
    })

    it('should handle large day values', () => {
      const baseDate = new Date(2024, 0, 1)
      const frequency = createCheckInFrequency({ value: 365, unit: 'days' })

      const nextDate = calculateNextCheckIn(baseDate, frequency)

      expect(nextDate.getFullYear()).toBe(2024)
      expect(nextDate.getMonth()).toBe(11)
      expect(nextDate.getDate()).toBe(31)
    })
  })
})
