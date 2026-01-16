import { describe, it, expect } from 'vitest'
import { createContactId, contactIdFromString } from '../ContactId'

describe('ContactId', () => {
  describe('createContactId', () => {
    it('should create a new ContactId with a valid UUID', () => {
      const id = createContactId()

      expect(id).toBeDefined()
      expect(typeof id).toBe('string')
    })

    it('should create unique ContactIds on each call', () => {
      const id1 = createContactId()
      const id2 = createContactId()

      expect(id1).not.toBe(id2)
    })
  })

  describe('contactIdFromString', () => {
    it('should create ContactId from valid UUID string', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000'

      const id = contactIdFromString(uuid)

      expect(id).toBe(uuid)
    })

    it('should throw error for invalid UUID format', () => {
      const invalidUuid = 'not-a-uuid'

      expect(() => contactIdFromString(invalidUuid)).toThrow(
        'Invalid ContactId format'
      )
    })

    it('should throw error for empty string', () => {
      expect(() => contactIdFromString('')).toThrow(
        'Invalid ContactId format'
      )
    })
  })
})
