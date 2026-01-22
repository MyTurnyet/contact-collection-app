import { describe, it, expect, beforeEach } from 'vitest'
import { GetCheckInHistory } from '../GetCheckInHistory'
import { InMemoryCheckInRepository } from '../test-doubles/InMemoryCheckInRepository'
import {
  createCheckIn,
  createCheckInId,
  CheckInStatus,
} from '../../../domain/checkin'
import { createContactId } from '../../../domain/contact'
import { addDays, addWeeks } from 'date-fns'

describe('GetCheckInHistory', () => {
  let repository: InMemoryCheckInRepository
  let getCheckInHistory: GetCheckInHistory

  beforeEach(() => {
    repository = new InMemoryCheckInRepository()
    getCheckInHistory = new GetCheckInHistory(repository)
  })

  it('should return all check-ins for a contact', async () => {
    const contactId = createContactId()

    const checkIn1 = createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate: new Date('2026-01-01'),
    })
    const checkIn2 = createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate: new Date('2026-01-15'),
      completionDate: new Date('2026-01-16'),
    })
    const checkIn3 = createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate: new Date('2026-02-01'),
    })

    await repository.save(checkIn1)
    await repository.save(checkIn2)
    await repository.save(checkIn3)

    const result = await getCheckInHistory.execute({ contactId })

    expect(result.size).toBe(3)
    const ids = result.toArray().map((c) => c.id)
    expect(ids).toContain(checkIn1.id)
    expect(ids).toContain(checkIn2.id)
    expect(ids).toContain(checkIn3.id)
  })

  it('should include both completed and scheduled check-ins', async () => {
    const contactId = createContactId()

    const completedCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate: new Date('2026-01-01'),
      completionDate: new Date('2026-01-02'),
    })
    const scheduledCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate: new Date('2026-02-01'),
    })

    await repository.save(completedCheckIn)
    await repository.save(scheduledCheckIn)

    const result = await getCheckInHistory.execute({ contactId })

    expect(result.size).toBe(2)
    const statuses = result.toArray().map((c) => c.status)
    expect(statuses).toContain(CheckInStatus.Completed)
    expect(statuses).toContain(CheckInStatus.Scheduled)
  })

  it('should include overdue check-ins', async () => {
    const today = new Date()
    const contactId = createContactId()

    const overdueCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate: addDays(today, -5),
    })

    await repository.save(overdueCheckIn)

    const result = await getCheckInHistory.execute({ contactId })

    expect(result.size).toBe(1)
    expect(result.toArray()[0].status).toBe(CheckInStatus.Overdue)
  })

  it('should not include check-ins from other contacts', async () => {
    const contactId1 = createContactId()
    const contactId2 = createContactId()

    const checkIn1 = createCheckIn({
      id: createCheckInId(),
      contactId: contactId1,
      scheduledDate: new Date('2026-01-01'),
    })
    const checkIn2 = createCheckIn({
      id: createCheckInId(),
      contactId: contactId2,
      scheduledDate: new Date('2026-01-01'),
    })

    await repository.save(checkIn1)
    await repository.save(checkIn2)

    const result = await getCheckInHistory.execute({ contactId: contactId1 })

    expect(result.size).toBe(1)
    expect(result.toArray()[0].id).toBe(checkIn1.id)
  })

  it('should return empty collection when contact has no check-ins', async () => {
    const contactId = createContactId()

    const result = await getCheckInHistory.execute({ contactId })

    expect(result.size).toBe(0)
  })

  it('should return check-ins in chronological order', async () => {
    const contactId = createContactId()

    const checkIn1 = createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate: new Date('2026-03-01'),
    })
    const checkIn2 = createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate: new Date('2026-01-01'),
    })
    const checkIn3 = createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate: new Date('2026-02-01'),
    })

    await repository.save(checkIn1)
    await repository.save(checkIn2)
    await repository.save(checkIn3)

    const result = await getCheckInHistory.execute({ contactId })

    const dates = result.toArray().map((c) => c.scheduledDate)
    expect(dates[0]).toEqual(new Date('2026-01-01'))
    expect(dates[1]).toEqual(new Date('2026-02-01'))
    expect(dates[2]).toEqual(new Date('2026-03-01'))
  })

  it('should handle many check-ins for same contact', async () => {
    const contactId = createContactId()
    const checkIns = []

    for (let i = 0; i < 20; i++) {
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId,
        scheduledDate: addWeeks(new Date('2026-01-01'), i),
      })
      checkIns.push(checkIn)
      await repository.save(checkIn)
    }

    const result = await getCheckInHistory.execute({ contactId })

    expect(result.size).toBe(20)
  })
})
