import { describe, it, expect } from 'vitest'
import {
  createCheckInId,
  checkInIdFromString,
  checkInIdEquals,
} from '../CheckInId'

describe('CheckInId', () => {
  describe('createCheckInId', () => {
    it('should create a new CheckInId with a valid UUID', () => {
      const id = createCheckInId()

      expect(id).toBeDefined()
      expect(typeof id).toBe('string')
    })

    it('should create unique CheckInIds on each call', () => {
      const id1 = createCheckInId()
      const id2 = createCheckInId()

      expect(id1).not.toBe(id2)
    })
  })

  describe('checkInIdFromString', () => {
    it('should create CheckInId from valid UUID string', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000'

      const id = checkInIdFromString(uuid)

      expect(id).toBe(uuid)
    })

    it('should throw error for invalid UUID format', () => {
      const invalidUuid = 'not-a-uuid'

      expect(() => checkInIdFromString(invalidUuid)).toThrow(
        'Invalid CheckInId format'
      )
    })

    it('should throw error for empty string', () => {
      expect(() => checkInIdFromString('')).toThrow(
        'Invalid CheckInId format'
      )
    })
  })

  describe('checkInIdEquals', () => {
    it('should return true for same CheckInIds', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000'
      const id1 = checkInIdFromString(uuid)
      const id2 = checkInIdFromString(uuid)

      expect(checkInIdEquals(id1, id2)).toBe(true)
    })

    it('should return false for different CheckInIds', () => {
      const id1 = createCheckInId()
      const id2 = createCheckInId()

      expect(checkInIdEquals(id1, id2)).toBe(false)
    })
  })
})
