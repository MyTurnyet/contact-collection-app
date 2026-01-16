import { describe, it, expect } from 'vitest'
import { createEmailAddress } from './EmailAddress'

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
})
