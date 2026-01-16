import { describe, it, expect } from 'vitest'
import {
  createUuidValueObject,
  uuidValueObjectFromString,
  uuidValueObjectEquals,
} from '../UuidValueObject'

type TestId = string & { readonly __brand: 'TestId' }

describe('UuidValueObject', () => {
  describe('createUuidValueObject', () => {
    it('should create a new UUID value object', () => {
      const id = createUuidValueObject<TestId>()

      expect(id).toBeDefined()
      expect(typeof id).toBe('string')
    })

    it('should create unique UUIDs on each call', () => {
      const id1 = createUuidValueObject<TestId>()
      const id2 = createUuidValueObject<TestId>()

      expect(id1).not.toBe(id2)
    })
  })

  describe('uuidValueObjectFromString', () => {
    it('should create UUID value object from valid UUID string', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000'

      const id = uuidValueObjectFromString<TestId>(uuid, 'TestId')

      expect(id).toBe(uuid)
    })

    it('should throw error for invalid UUID format', () => {
      const invalidUuid = 'not-a-uuid'

      expect(() =>
        uuidValueObjectFromString<TestId>(invalidUuid, 'TestId')
      ).toThrow('Invalid TestId format')
    })

    it('should throw error for empty string', () => {
      expect(() => uuidValueObjectFromString<TestId>('', 'TestId')).toThrow(
        'Invalid TestId format'
      )
    })

    it('should include type name in error message', () => {
      expect(() =>
        uuidValueObjectFromString<TestId>('invalid', 'CustomType')
      ).toThrow('Invalid CustomType format')
    })
  })

  describe('uuidValueObjectEquals', () => {
    it('should return true for same UUID values', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000'
      const id1 = uuidValueObjectFromString<TestId>(uuid, 'TestId')
      const id2 = uuidValueObjectFromString<TestId>(uuid, 'TestId')

      expect(uuidValueObjectEquals(id1, id2)).toBe(true)
    })

    it('should return false for different UUID values', () => {
      const id1 = createUuidValueObject<TestId>()
      const id2 = createUuidValueObject<TestId>()

      expect(uuidValueObjectEquals(id1, id2)).toBe(false)
    })
  })
})
