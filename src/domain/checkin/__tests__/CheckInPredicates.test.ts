import { describe, it, expect } from 'vitest'
import { createCheckIn } from '../CheckIn'
import { createCheckInId } from '../CheckInId'
import { createContactId } from '../../contact/ContactId'
import { createScheduledDate } from '../ScheduledDate'
import { createCompletionDate } from '../CompletionDate'
import {
  isCompleted,
  isNotCompleted,
  isScheduled,
  isOverdue,
} from '../CheckInPredicates'

describe('CheckInPredicates', () => {
  describe('isCompleted', () => {
    it('should return true for completed check-in', () => {
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(new Date('2024-01-15')),
        completionDate: createCompletionDate(new Date('2024-01-15')),
      })

      expect(isCompleted(checkIn)).toBe(true)
    })

    it('should return false for scheduled check-in', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)

      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(futureDate),
      })

      expect(isCompleted(checkIn)).toBe(false)
    })

    it('should return false for overdue check-in', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 7)

      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(pastDate),
      })

      expect(isCompleted(checkIn)).toBe(false)
    })
  })

  describe('isNotCompleted', () => {
    it('should return false for completed check-in', () => {
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(new Date('2024-01-15')),
        completionDate: createCompletionDate(new Date('2024-01-15')),
      })

      expect(isNotCompleted(checkIn)).toBe(false)
    })

    it('should return true for scheduled check-in', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)

      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(futureDate),
      })

      expect(isNotCompleted(checkIn)).toBe(true)
    })

    it('should return true for overdue check-in', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 7)

      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(pastDate),
      })

      expect(isNotCompleted(checkIn)).toBe(true)
    })
  })

  describe('isScheduled', () => {
    it('should return true for scheduled check-in', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)

      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(futureDate),
      })

      expect(isScheduled(checkIn)).toBe(true)
    })

    it('should return false for completed check-in', () => {
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(new Date('2024-01-15')),
        completionDate: createCompletionDate(new Date('2024-01-15')),
      })

      expect(isScheduled(checkIn)).toBe(false)
    })

    it('should return false for overdue check-in', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 7)

      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(pastDate),
      })

      expect(isScheduled(checkIn)).toBe(false)
    })
  })

  describe('isOverdue', () => {
    it('should return true for overdue check-in', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 7)

      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(pastDate),
      })

      expect(isOverdue(checkIn)).toBe(true)
    })

    it('should return false for scheduled check-in', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)

      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(futureDate),
      })

      expect(isOverdue(checkIn)).toBe(false)
    })

    it('should return false for completed check-in', () => {
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(new Date('2024-01-15')),
        completionDate: createCompletionDate(new Date('2024-01-15')),
      })

      expect(isOverdue(checkIn)).toBe(false)
    })
  })
})
