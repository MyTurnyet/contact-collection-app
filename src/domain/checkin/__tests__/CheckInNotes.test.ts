import { describe, it, expect } from 'vitest'
import {
  createCheckInNotes,
  checkInNotesEquals,
  createNullCheckInNotes,
  isNullCheckInNotes,
} from '../CheckInNotes'

describe('CheckInNotes', () => {
  describe('createCheckInNotes', () => {
    it('should create notes from string', () => {
      const notes = createCheckInNotes('Had a great conversation')

      expect(notes).toBe('Had a great conversation')
    })

    it('should trim whitespace', () => {
      const notes = createCheckInNotes('  Had a great conversation  ')

      expect(notes).toBe('Had a great conversation')
    })

    it('should allow empty notes', () => {
      const notes = createCheckInNotes('')

      expect(notes).toBe('')
    })

    it('should allow multiline notes', () => {
      const notesText = 'Line 1\nLine 2\nLine 3'

      const notes = createCheckInNotes(notesText)

      expect(notes).toBe(notesText)
    })

    it('should allow long notes', () => {
      const longNotes = 'A'.repeat(1000)

      const notes = createCheckInNotes(longNotes)

      expect(notes).toBe(longNotes)
    })
  })

  describe('checkInNotesEquals', () => {
    it('should return true for same notes', () => {
      const notes1 = createCheckInNotes('Same text')
      const notes2 = createCheckInNotes('Same text')

      expect(checkInNotesEquals(notes1, notes2)).toBe(true)
    })

    it('should return false for different notes', () => {
      const notes1 = createCheckInNotes('Text 1')
      const notes2 = createCheckInNotes('Text 2')

      expect(checkInNotesEquals(notes1, notes2)).toBe(false)
    })

    it('should return true for empty notes', () => {
      const notes1 = createCheckInNotes('')
      const notes2 = createCheckInNotes('')

      expect(checkInNotesEquals(notes1, notes2)).toBe(true)
    })
  })

  describe('null object pattern', () => {
    it('should create null notes', () => {
      const nullNotes = createNullCheckInNotes()

      expect(nullNotes).toBeDefined()
      expect(nullNotes).toBe('')
    })

    it('should identify null notes', () => {
      const nullNotes = createNullCheckInNotes()

      expect(isNullCheckInNotes(nullNotes)).toBe(true)
    })

    it('should not identify regular notes as null', () => {
      const regularNotes = createCheckInNotes('Some notes')

      expect(isNullCheckInNotes(regularNotes)).toBe(false)
    })

    it('should always return same null instance', () => {
      const null1 = createNullCheckInNotes()
      const null2 = createNullCheckInNotes()

      expect(null1).toBe(null2)
    })
  })
})
