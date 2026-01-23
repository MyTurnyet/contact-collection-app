import { describe, it, expect } from 'vitest'
import {
  ApplicationError,
  ValidationError,
  DomainError,
  isApplicationError,
  isValidationError,
  isDomainError,
} from '../ApplicationError'

describe('ApplicationError', () => {
  describe('ApplicationError base class', () => {
    it('should create error with code and message', () => {
      // Given
      const code = 'TEST_ERROR'
      const message = 'Test error message'

      // When
      const error = new ApplicationError(code, message)

      // Then
      expect(error.code).toBe(code)
      expect(error.message).toBe(message)
      expect(error.name).toBe('ApplicationError')
      expect(error).toBeInstanceOf(Error)
    })

    it('should include optional context', () => {
      // Given
      const context = { userId: '123', action: 'create' }

      // When
      const error = new ApplicationError('TEST', 'Message', context)

      // Then
      expect(error.context).toEqual(context)
    })

    it('should have undefined context when not provided', () => {
      // Given/When
      const error = new ApplicationError('TEST', 'Message')

      // Then
      expect(error.context).toBeUndefined()
    })
  })

  describe('ValidationError', () => {
    it('should create validation error with field information', () => {
      // Given
      const field = 'email'
      const message = 'Invalid email format'

      // When
      const error = new ValidationError(field, message)

      // Then
      expect(error.field).toBe(field)
      expect(error.message).toBe(message)
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.name).toBe('ValidationError')
      expect(error).toBeInstanceOf(ApplicationError)
    })

    it('should include validation details', () => {
      // Given
      const details = { pattern: '/^[^@]+@[^@]+$/', provided: 'invalid' }

      // When
      const error = new ValidationError('email', 'Invalid', details)

      // Then
      expect(error.details).toEqual(details)
    })

    it('should have undefined details when not provided', () => {
      // Given/When
      const error = new ValidationError('email', 'Invalid')

      // Then
      expect(error.details).toBeUndefined()
    })
  })

  describe('DomainError', () => {
    it('should create domain error for business rule violation', () => {
      // Given
      const code = 'CONTACT_ALREADY_EXISTS'
      const message = 'A contact with this email already exists'

      // When
      const error = new DomainError(code, message)

      // Then
      expect(error.code).toBe(code)
      expect(error.message).toBe(message)
      expect(error.name).toBe('DomainError')
      expect(error).toBeInstanceOf(ApplicationError)
    })

    it('should include rule information in context', () => {
      // Given
      const context = { rule: 'unique_email', email: 'test@example.com' }

      // When
      const error = new DomainError('DUPLICATE', 'Duplicate found', context)

      // Then
      expect(error.context).toEqual(context)
    })
  })

  describe('Type guards', () => {
    describe('isApplicationError', () => {
      it('should return true for ApplicationError instance', () => {
        // Given
        const error = new ApplicationError('TEST', 'Message')

        // When/Then
        expect(isApplicationError(error)).toBe(true)
      })

      it('should return true for ValidationError instance', () => {
        // Given
        const error = new ValidationError('field', 'Message')

        // When/Then
        expect(isApplicationError(error)).toBe(true)
      })

      it('should return true for DomainError instance', () => {
        // Given
        const error = new DomainError('CODE', 'Message')

        // When/Then
        expect(isApplicationError(error)).toBe(true)
      })

      it('should return false for generic Error', () => {
        // Given
        const error = new Error('Generic error')

        // When/Then
        expect(isApplicationError(error)).toBe(false)
      })

      it('should return false for non-error values', () => {
        // When/Then
        expect(isApplicationError(null)).toBe(false)
        expect(isApplicationError(undefined)).toBe(false)
        expect(isApplicationError('error')).toBe(false)
        expect(isApplicationError({})).toBe(false)
      })
    })

    describe('isValidationError', () => {
      it('should return true for ValidationError instance', () => {
        // Given
        const error = new ValidationError('field', 'Message')

        // When/Then
        expect(isValidationError(error)).toBe(true)
      })

      it('should return false for ApplicationError instance', () => {
        // Given
        const error = new ApplicationError('TEST', 'Message')

        // When/Then
        expect(isValidationError(error)).toBe(false)
      })

      it('should return false for DomainError instance', () => {
        // Given
        const error = new DomainError('CODE', 'Message')

        // When/Then
        expect(isValidationError(error)).toBe(false)
      })

      it('should return false for non-error values', () => {
        // When/Then
        expect(isValidationError(null)).toBe(false)
        expect(isValidationError(new Error('test'))).toBe(false)
      })
    })

    describe('isDomainError', () => {
      it('should return true for DomainError instance', () => {
        // Given
        const error = new DomainError('CODE', 'Message')

        // When/Then
        expect(isDomainError(error)).toBe(true)
      })

      it('should return false for ApplicationError instance', () => {
        // Given
        const error = new ApplicationError('TEST', 'Message')

        // When/Then
        expect(isDomainError(error)).toBe(false)
      })

      it('should return false for ValidationError instance', () => {
        // Given
        const error = new ValidationError('field', 'Message')

        // When/Then
        expect(isDomainError(error)).toBe(false)
      })

      it('should return false for non-error values', () => {
        // When/Then
        expect(isDomainError(null)).toBe(false)
        expect(isDomainError(new Error('test'))).toBe(false)
      })
    })
  })
})
