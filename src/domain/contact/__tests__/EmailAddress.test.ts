import { describe, it, expect } from 'vitest'
import {
  createEmailAddress,
  emailAddressEquals,
  createNullEmailAddress,
  isNullEmailAddress,
} from '../EmailAddress'

describe('EmailAddress', () => {
  describe('createEmailAddress', () => {
    it('should create EmailAddress from valid email', () => {
      const email = createEmailAddress('user@example.com')

      expect(email).toBeDefined()
      expect(typeof email).toBe('string')
    })

    it('should accept email with subdomain', () => {
      const email = createEmailAddress('user@mail.example.com')

      expect(email).toBeDefined()
    })

    it('should accept email with numbers', () => {
      const email = createEmailAddress('user123@example456.com')

      expect(email).toBeDefined()
    })

    it('should accept email with dots in local part', () => {
      const email = createEmailAddress('first.last@example.com')

      expect(email).toBeDefined()
    })

    it('should accept email with plus sign', () => {
      const email = createEmailAddress('user+tag@example.com')

      expect(email).toBeDefined()
    })

    it('should throw error for missing @ symbol', () => {
      expect(() => createEmailAddress('userexample.com')).toThrow(
        'Invalid email address format'
      )
    })

    it('should throw error for missing domain', () => {
      expect(() => createEmailAddress('user@')).toThrow(
        'Invalid email address format'
      )
    })

    it('should throw error for missing local part', () => {
      expect(() => createEmailAddress('@example.com')).toThrow(
        'Invalid email address format'
      )
    })

    it('should throw error for empty string', () => {
      expect(() => createEmailAddress('')).toThrow(
        'Invalid email address format'
      )
    })

    it('should throw error for spaces in email', () => {
      expect(() => createEmailAddress('user @example.com')).toThrow(
        'Invalid email address format'
      )
    })

    it('should normalize email to lowercase', () => {
      const email = createEmailAddress('User@EXAMPLE.COM')

      expect(email).toBe('user@example.com')
    })
  })

  describe('emailAddressEquals', () => {
    it('should return true for normalized same emails', () => {
      const email1 = createEmailAddress('User@Example.COM')
      const email2 = createEmailAddress('user@example.com')

      expect(emailAddressEquals(email1, email2)).toBe(true)
    })

    it('should return false for different emails', () => {
      const email1 = createEmailAddress('user1@example.com')
      const email2 = createEmailAddress('user2@example.com')

      expect(emailAddressEquals(email1, email2)).toBe(false)
    })
  })

  describe('createNullEmailAddress', () => {
    it('should return consistent singleton', () => {
      const null1 = createNullEmailAddress()
      const null2 = createNullEmailAddress()

      expect(null1).toBe(null2)
    })

    it('should have empty string as display value', () => {
      const nullEmail = createNullEmailAddress()

      expect(nullEmail).toBe('')
    })

    it('should be equal to other null email addresses', () => {
      const null1 = createNullEmailAddress()
      const null2 = createNullEmailAddress()

      expect(emailAddressEquals(null1, null2)).toBe(true)
    })
  })

  describe('isNullEmailAddress', () => {
    it('should return true for null email address', () => {
      const nullEmail = createNullEmailAddress()

      expect(isNullEmailAddress(nullEmail)).toBe(true)
    })

    it('should return false for real email address', () => {
      const email = createEmailAddress('user@example.com')

      expect(isNullEmailAddress(email)).toBe(false)
    })

    it('should return false for different real email addresses', () => {
      const email1 = createEmailAddress('user1@example.com')
      const email2 = createEmailAddress('user2@example.com')

      expect(isNullEmailAddress(email1)).toBe(false)
      expect(isNullEmailAddress(email2)).toBe(false)
    })
  })
})
