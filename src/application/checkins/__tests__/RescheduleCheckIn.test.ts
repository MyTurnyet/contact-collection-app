import { describe, it, expect, beforeEach } from 'vitest'
import { RescheduleCheckIn } from '../RescheduleCheckIn'
import { InMemoryCheckInRepository } from '../test-doubles/InMemoryCheckInRepository'
import {
  createCheckIn,
  createCheckInId,
  CheckInStatus,
  createScheduledDate,
  createCompletionDate,
  createCheckInNotes,
} from '../../../domain/checkin'
import { createContactId } from '../../../domain/contact'
import { addDays } from 'date-fns'

describe('RescheduleCheckIn', () => {
  let repository: InMemoryCheckInRepository
  let rescheduleCheckIn: RescheduleCheckIn

  beforeEach(() => {
    repository = new InMemoryCheckInRepository()
    rescheduleCheckIn = new RescheduleCheckIn(repository)
  })

  it('should update check-in to new scheduled date', async () => {
    const originalDate = createScheduledDate(new Date('2026-02-01'))
    const newDate = createScheduledDate(new Date('2026-02-15'))

    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: originalDate,
    })
    await repository.save(checkIn)

    const result = await rescheduleCheckIn.execute({
      checkInId: checkIn.id,
      newScheduledDate: newDate,
    })

    expect(result.scheduledDate).toEqual(newDate)
    expect(result.id).toBe(checkIn.id)
    expect(result.contactId).toBe(checkIn.contactId)
  })

  it('should maintain scheduled status after rescheduling', async () => {
    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2026-02-01')),
    })
    await repository.save(checkIn)

    const newDate = createScheduledDate(new Date('2026-03-01'))
    const result = await rescheduleCheckIn.execute({
      checkInId: checkIn.id,
      newScheduledDate: newDate,
    })

    expect(result.status).toBe(CheckInStatus.Scheduled)
  })

  it('should change overdue check-in to scheduled when rescheduled to future', async () => {
    const today = new Date()
    const pastDate = addDays(today, -5)
    const futureDate = addDays(today, 5)

    const overdueCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(pastDate),
    })
    await repository.save(overdueCheckIn)

    expect(overdueCheckIn.status).toBe(CheckInStatus.Overdue)

    const result = await rescheduleCheckIn.execute({
      checkInId: overdueCheckIn.id,
      newScheduledDate: createScheduledDate(futureDate),
    })

    expect(result.status).toBe(CheckInStatus.Scheduled)
  })

  it('should save rescheduled check-in to repository', async () => {
    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2026-02-01')),
    })
    await repository.save(checkIn)

    const newDate = createScheduledDate(new Date('2026-02-20'))
    await rescheduleCheckIn.execute({
      checkInId: checkIn.id,
      newScheduledDate: newDate,
    })

    const saved = await repository.findById(checkIn.id)
    expect(saved).toBeDefined()
    expect(saved?.scheduledDate).toEqual(newDate)
  })

  it('should allow rescheduling to earlier date', async () => {
    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2026-03-15')),
    })
    await repository.save(checkIn)

    const earlierDate = createScheduledDate(new Date('2026-02-01'))
    const result = await rescheduleCheckIn.execute({
      checkInId: checkIn.id,
      newScheduledDate: earlierDate,
    })

    expect(result.scheduledDate).toEqual(earlierDate)
  })

  it('should throw error when check-in not found', async () => {
    const nonExistentId = createCheckInId()

    await expect(
      rescheduleCheckIn.execute({
        checkInId: nonExistentId,
        newScheduledDate: createScheduledDate(new Date('2026-02-01')),
      })
    ).rejects.toThrow('Check-in not found')
  })

  it('should not modify completion date or notes when rescheduling', async () => {
    const completionDate = createCompletionDate(new Date('2026-02-01'))
    const notes = createCheckInNotes('Original notes')

    const completedCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2026-02-01')),
      completionDate,
      notes,
    })
    await repository.save(completedCheckIn)

    const newDate = createScheduledDate(new Date('2026-03-01'))
    const result = await rescheduleCheckIn.execute({
      checkInId: completedCheckIn.id,
      newScheduledDate: newDate,
    })

    expect(result.completionDate).toEqual(completionDate)
    expect(result.notes).toBe(notes)
  })
})
