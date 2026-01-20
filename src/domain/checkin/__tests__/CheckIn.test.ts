import { describe, it, expect } from 'vitest'
import {
  createCheckIn,
  checkInEquals,
  createNullCheckIn,
  isNullCheckIn,
} from '../CheckIn'
import { createCheckInId } from '../CheckInId'
import { createContactId } from '../../contact'
import { createScheduledDate } from '../ScheduledDate'
import { createCompletionDate, createNullCompletionDate } from '../CompletionDate'
import { createCheckInNotes, createNullCheckInNotes } from '../CheckInNotes'
import { CheckInStatus } from '../CheckInStatus'

describe('CheckIn', () => {
  describe('createCheckIn', () => {
    it('should create a check-in with required fields', () => {
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(new Date('2024-12-25')),
      })

      expect(checkIn).toBeDefined()
      expect(checkIn.id).toBeDefined()
      expect(checkIn.contactId).toBeDefined()
      expect(checkIn.scheduledDate).toBeDefined()
    })

    it('should create check-in with null completion date by default', () => {
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(new Date('2024-12-25')),
      })

      expect(checkIn.completionDate).toBe(createNullCompletionDate())
    })

    it('should create check-in with null notes by default', () => {
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(new Date('2024-12-25')),
      })

      expect(checkIn.notes).toBe(createNullCheckInNotes())
    })

    it('should create check-in with optional completion date', () => {
      const completionDate = createCompletionDate(new Date('2024-12-26'))

      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(new Date('2024-12-25')),
        completionDate,
      })

      expect(checkIn.completionDate).toBe(completionDate)
    })

    it('should create check-in with optional notes', () => {
      const notes = createCheckInNotes('Great conversation')

      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(new Date('2024-12-25')),
        notes,
      })

      expect(checkIn.notes).toBe(notes)
    })

    it('should be immutable', () => {
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(new Date('2024-12-25')),
      })

      expect(Object.isFrozen(checkIn)).toBe(true)
    })
  })

  describe('status calculation', () => {
    it('should have Completed status when completion date is set', () => {
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(new Date('2024-12-25')),
        completionDate: createCompletionDate(new Date('2024-12-26')),
      })

      expect(checkIn.status).toBe(CheckInStatus.Completed)
    })

    it('should have Scheduled status for future dates', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)

      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(futureDate),
      })

      expect(checkIn.status).toBe(CheckInStatus.Scheduled)
    })

    it('should have Overdue status for past dates without completion', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 7)

      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(pastDate),
      })

      expect(checkIn.status).toBe(CheckInStatus.Overdue)
    })
  })

  describe('checkInEquals', () => {
    it('should return true for same check-ins', () => {
      const id = createCheckInId()
      const contactId = createContactId()
      const scheduledDate = createScheduledDate(new Date('2024-12-25'))

      const checkIn1 = createCheckIn({ id, contactId, scheduledDate })
      const checkIn2 = createCheckIn({ id, contactId, scheduledDate })

      expect(checkInEquals(checkIn1, checkIn2)).toBe(true)
    })

    it('should return false for different ids', () => {
      const contactId = createContactId()
      const scheduledDate = createScheduledDate(new Date('2024-12-25'))

      const checkIn1 = createCheckIn({
        id: createCheckInId(),
        contactId,
        scheduledDate,
      })
      const checkIn2 = createCheckIn({
        id: createCheckInId(),
        contactId,
        scheduledDate,
      })

      expect(checkInEquals(checkIn1, checkIn2)).toBe(false)
    })
  })

  describe('null object pattern', () => {
    it('should create null check-in', () => {
      const nullCheckIn = createNullCheckIn()

      expect(nullCheckIn).toBeDefined()
    })

    it('should identify null check-in', () => {
      const nullCheckIn = createNullCheckIn()

      expect(isNullCheckIn(nullCheckIn)).toBe(true)
    })

    it('should not identify regular check-in as null', () => {
      const regularCheckIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(new Date('2024-12-25')),
      })

      expect(isNullCheckIn(regularCheckIn)).toBe(false)
    })

    it('should always return same null instance', () => {
      const null1 = createNullCheckIn()
      const null2 = createNullCheckIn()

      expect(null1).toBe(null2)
    })
  })
})
