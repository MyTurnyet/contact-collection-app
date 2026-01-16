import { describe, it, expect } from 'vitest'
import {
  createPhoneNumber,
  phoneNumberEquals,
  createNullPhoneNumber,
  isNullPhoneNumber,
} from '../PhoneNumber'

describe('PhoneNumber', () => {
  describe('createPhoneNumber', () => {
    it('should create PhoneNumber from valid format with dashes', () => {
      const phone = createPhoneNumber('555-123-4567')

      expect(phone).toBeDefined()
      expect(typeof phone).toBe('string')
    })

    it('should create PhoneNumber from valid format with parentheses', () => {
      const phone = createPhoneNumber('(555) 123-4567')

      expect(phone).toBeDefined()
    })

    it('should create PhoneNumber from digits only', () => {
      const phone = createPhoneNumber('5551234567')

      expect(phone).toBeDefined()
    })

    it('should create PhoneNumber with country code', () => {
      const phone = createPhoneNumber('+1-555-123-4567')

      expect(phone).toBeDefined()
    })

    it('should throw error for invalid phone number with letters', () => {
      expect(() => createPhoneNumber('555-ABC-DEFG')).toThrow(
        'Invalid phone number format'
      )
    })

    it('should throw error for too short phone number', () => {
      expect(() => createPhoneNumber('123')).toThrow(
        'Invalid phone number format'
      )
    })

    it('should throw error for empty string', () => {
      expect(() => createPhoneNumber('')).toThrow(
        'Invalid phone number format'
      )
    })

    it('should normalize phone number by removing formatting', () => {
      const phone = createPhoneNumber('(555) 123-4567')

      expect(phone).toBe('+15551234567')
    })
  })

  describe('phoneNumberEquals', () => {
    it('should return true for normalized same numbers', () => {
      const phone1 = createPhoneNumber('(555) 123-4567')
      const phone2 = createPhoneNumber('555-123-4567')

      expect(phoneNumberEquals(phone1, phone2)).toBe(true)
    })

    it('should return false for different numbers', () => {
      const phone1 = createPhoneNumber('555-123-4567')
      const phone2 = createPhoneNumber('555-987-6543')

      expect(phoneNumberEquals(phone1, phone2)).toBe(false)
    })
  })

  describe('createNullPhoneNumber', () => {
    it('should return consistent singleton', () => {
      const null1 = createNullPhoneNumber()
      const null2 = createNullPhoneNumber()

      expect(null1).toBe(null2)
    })

    it('should have empty string as display value', () => {
      const nullPhone = createNullPhoneNumber()

      expect(nullPhone).toBe('')
    })

    it('should be equal to other null phone numbers', () => {
      const null1 = createNullPhoneNumber()
      const null2 = createNullPhoneNumber()

      expect(phoneNumberEquals(null1, null2)).toBe(true)
    })
  })

  describe('isNullPhoneNumber', () => {
    it('should return true for null phone number', () => {
      const nullPhone = createNullPhoneNumber()

      expect(isNullPhoneNumber(nullPhone)).toBe(true)
    })

    it('should return false for real phone number', () => {
      const phone = createPhoneNumber('555-123-4567')

      expect(isNullPhoneNumber(phone)).toBe(false)
    })

    it('should return false for different real phone numbers', () => {
      const phone1 = createPhoneNumber('555-123-4567')
      const phone2 = createPhoneNumber('555-987-6543')

      expect(isNullPhoneNumber(phone1)).toBe(false)
      expect(isNullPhoneNumber(phone2)).toBe(false)
    })
  })
})
