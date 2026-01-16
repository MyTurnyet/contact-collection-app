import { describe, it, expect } from 'vitest'
import { createRelationshipContext, relationshipContextEquals } from '../RelationshipContext'

describe('RelationshipContext', () => {
  describe('createRelationshipContext', () => {
    it('should create RelationshipContext from valid text', () => {
      const context = createRelationshipContext('College friend')

      expect(context).toBeDefined()
      expect(typeof context).toBe('string')
      expect(context).toBe('College friend')
    })

    it('should create RelationshipContext for family', () => {
      const context = createRelationshipContext('Family member')

      expect(context).toBe('Family member')
    })

    it('should create RelationshipContext for work', () => {
      const context = createRelationshipContext('Former coworker')

      expect(context).toBe('Former coworker')
    })

    it('should throw error for empty string', () => {
      expect(() => createRelationshipContext('')).toThrow(
        'Relationship context cannot be empty'
      )
    })

    it('should throw error for whitespace only', () => {
      expect(() => createRelationshipContext('   ')).toThrow(
        'Relationship context cannot be empty'
      )
    })

    it('should trim whitespace from context', () => {
      const context = createRelationshipContext('  College friend  ')

      expect(context).toBe('College friend')
    })

    it('should allow long relationship descriptions', () => {
      const longContext =
        'Met at tech conference in 2019, worked together on open source project'

      const context = createRelationshipContext(longContext)

      expect(context).toBe(longContext)
    })
  })
})

  describe("relationshipContextEquals", () => {
    it("should return true for same contexts", () => {
      const context1 = createRelationshipContext("Friend")
      const context2 = createRelationshipContext("Friend")

      expect(relationshipContextEquals(context1, context2)).toBe(true)
    })

    it("should return false for different contexts", () => {
      const context1 = createRelationshipContext("Friend")
      const context2 = createRelationshipContext("Family")

      expect(relationshipContextEquals(context1, context2)).toBe(false)
    })
  })
