import { describe, it, expect } from 'vitest'
import { createImportantDate, importantDateEquals } from '../ImportantDate'

describe('ImportantDate', () => {
  describe('createImportantDate', () => {
    it('should create ImportantDate with date and description', () => {
      const importantDate = createImportantDate({
        date: new Date('1990-05-15'),
        description: 'Birthday',
      })

      expect(importantDate).toBeDefined()
      expect(importantDate.date).toEqual(new Date('1990-05-15'))
      expect(importantDate.description).toBe('Birthday')
    })

    it('should create ImportantDate for anniversary', () => {
      const importantDate = createImportantDate({
        date: new Date('2010-06-20'),
        description: 'Wedding Anniversary',
      })

      expect(importantDate.description).toBe('Wedding Anniversary')
    })

    it('should throw error for empty description', () => {
      expect(() =>
        createImportantDate({
          date: new Date('1990-05-15'),
          description: '',
        })
      ).toThrow('Description is required')
    })

    it('should throw error for whitespace only description', () => {
      expect(() =>
        createImportantDate({
          date: new Date('1990-05-15'),
          description: '   ',
        })
      ).toThrow('Description is required')
    })

    it('should throw error for invalid date', () => {
      expect(() =>
        createImportantDate({
          date: new Date('invalid'),
          description: 'Birthday',
        })
      ).toThrow('Invalid date')
    })

    it('should trim whitespace from description', () => {
      const importantDate = createImportantDate({
        date: new Date('1990-05-15'),
        description: '  Birthday  ',
      })

      expect(importantDate.description).toBe('Birthday')
    })

    it('should create immutable ImportantDate', () => {
      const importantDate = createImportantDate({
        date: new Date('1990-05-15'),
        description: 'Birthday',
      })

      expect(() => {
        // @ts-expect-error - Testing immutability
        importantDate.description = 'Anniversary'
      }).toThrow()
    })
  })
})

  describe("importantDateEquals", () => {
    it("should return true for same dates", () => {
      const date1 = createImportantDate({
        date: new Date("1990-05-15"),
        description: "Birthday",
      })
      const date2 = createImportantDate({
        date: new Date("1990-05-15"),
        description: "Birthday",
      })

      expect(importantDateEquals(date1, date2)).toBe(true)
    })

    it("should return false for different dates", () => {
      const date1 = createImportantDate({
        date: new Date("1990-05-15"),
        description: "Birthday",
      })
      const date2 = createImportantDate({
        date: new Date("1995-06-20"),
        description: "Birthday",
      })

      expect(importantDateEquals(date1, date2)).toBe(false)
    })

    it("should return false for same date but different description", () => {
      const date1 = createImportantDate({
        date: new Date("1990-05-15"),
        description: "Birthday",
      })
      const date2 = createImportantDate({
        date: new Date("1990-05-15"),
        description: "Anniversary",
      })

      expect(importantDateEquals(date1, date2)).toBe(false)
    })
  })
