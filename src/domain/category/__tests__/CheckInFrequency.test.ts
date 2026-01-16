import { describe, it, expect } from 'vitest'
import {
  createCheckInFrequency,
  checkInFrequencyEquals,
} from '../CheckInFrequency'

describe('CheckInFrequency', () => {
  describe('createCheckInFrequency', () => {
    it('should create frequency with days unit', () => {
      const frequency = createCheckInFrequency({ value: 7, unit: 'days' })

      expect(frequency).toBeDefined()
      expect(frequency.value).toBe(7)
      expect(frequency.unit).toBe('days')
    })

    it('should create frequency with weeks unit', () => {
      const frequency = createCheckInFrequency({ value: 2, unit: 'weeks' })

      expect(frequency).toBeDefined()
      expect(frequency.value).toBe(2)
      expect(frequency.unit).toBe('weeks')
    })

    it('should create frequency with months unit', () => {
      const frequency = createCheckInFrequency({ value: 3, unit: 'months' })

      expect(frequency).toBeDefined()
      expect(frequency.value).toBe(3)
      expect(frequency.unit).toBe('months')
    })

    it('should throw error for zero value', () => {
      expect(() =>
        createCheckInFrequency({ value: 0, unit: 'days' })
      ).toThrow('Frequency value must be greater than 0')
    })

    it('should throw error for negative value', () => {
      expect(() =>
        createCheckInFrequency({ value: -5, unit: 'weeks' })
      ).toThrow('Frequency value must be greater than 0')
    })

    it('should throw error for non-integer value', () => {
      expect(() =>
        createCheckInFrequency({ value: 2.5, unit: 'days' })
      ).toThrow('Frequency value must be a whole number')
    })

    it('should throw error for value exceeding 365', () => {
      expect(() =>
        createCheckInFrequency({ value: 366, unit: 'days' })
      ).toThrow('Frequency value cannot exceed 365')
    })

    it('should accept value of exactly 365', () => {
      const frequency = createCheckInFrequency({ value: 365, unit: 'days' })

      expect(frequency.value).toBe(365)
    })

    it('should create immutable frequency', () => {
      const frequency = createCheckInFrequency({ value: 7, unit: 'days' })

      expect(() => {
        // @ts-expect-error - Testing immutability
        frequency.value = 10
      }).toThrow()
    })
  })

  describe('checkInFrequencyEquals', () => {
    it('should return true for same frequencies', () => {
      const freq1 = createCheckInFrequency({ value: 7, unit: 'days' })
      const freq2 = createCheckInFrequency({ value: 7, unit: 'days' })

      expect(checkInFrequencyEquals(freq1, freq2)).toBe(true)
    })

    it('should return false for different values', () => {
      const freq1 = createCheckInFrequency({ value: 7, unit: 'days' })
      const freq2 = createCheckInFrequency({ value: 14, unit: 'days' })

      expect(checkInFrequencyEquals(freq1, freq2)).toBe(false)
    })

    it('should return false for different units', () => {
      const freq1 = createCheckInFrequency({ value: 1, unit: 'weeks' })
      const freq2 = createCheckInFrequency({ value: 1, unit: 'months' })

      expect(checkInFrequencyEquals(freq1, freq2)).toBe(false)
    })
  })
})
