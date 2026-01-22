import { describe, it, expect, beforeEach } from 'vitest'
import { GetOverdueCheckIns } from '../GetOverdueCheckIns'
import { InMemoryCheckInRepository } from '../test-doubles/InMemoryCheckInRepository'
import {
  createCheckIn,
  createCheckInId,
  CheckInStatus,
  createScheduledDate,
  createCompletionDate,
} from '../../../domain/checkin'
import { createContactId } from '../../../domain/contact'
import { addDays } from 'date-fns'

describe('GetOverdueCheckIns', () => {
  let repository: InMemoryCheckInRepository
  let getOverdueCheckIns: GetOverdueCheckIns

  beforeEach(() => {
    repository = new InMemoryCheckInRepository()
    getOverdueCheckIns = new GetOverdueCheckIns(repository)
  })

  it('should return check-ins that are overdue', async () => {
    const today = new Date()
    const yesterday = addDays(today, -1)
    const lastWeek = addDays(today, -7)

    const overdueCheckIn1 = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(yesterday),
    })
    const overdueCheckIn2 = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(lastWeek),
    })

    await repository.save(overdueCheckIn1)
    await repository.save(overdueCheckIn2)

    const result = await getOverdueCheckIns.execute()

    expect(result.size).toBe(2)
    const ids = result.toArray().map((c) => c.id)
    expect(ids).toContain(overdueCheckIn1.id)
    expect(ids).toContain(overdueCheckIn2.id)
  })

  it('should not include scheduled check-ins', async () => {
    const today = new Date()
    const yesterday = addDays(today, -1)
    const tomorrow = addDays(today, 1)

    const overdueCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(yesterday),
    })
    const scheduledCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(tomorrow),
    })

    await repository.save(overdueCheckIn)
    await repository.save(scheduledCheckIn)

    const result = await getOverdueCheckIns.execute()

    expect(result.size).toBe(1)
    expect(result.toArray()[0].id).toBe(overdueCheckIn.id)
    expect(result.toArray()[0].status).toBe(CheckInStatus.Overdue)
  })

  it('should not include completed check-ins', async () => {
    const today = new Date()
    const yesterday = addDays(today, -1)

    const completedCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(yesterday),
      completionDate: createCompletionDate(today),
    })
    const overdueCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(yesterday),
    })

    await repository.save(completedCheckIn)
    await repository.save(overdueCheckIn)

    const result = await getOverdueCheckIns.execute()

    expect(result.size).toBe(1)
    expect(result.toArray()[0].id).toBe(overdueCheckIn.id)
  })

  it('should return empty collection when no overdue check-ins', async () => {
    const today = new Date()
    const tomorrow = addDays(today, 1)

    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(tomorrow),
    })

    await repository.save(checkIn)

    const result = await getOverdueCheckIns.execute()

    expect(result.size).toBe(0)
  })

  it('should return all overdue check-ins regardless of how old', async () => {
    const today = new Date()
    const oneMonthAgo = addDays(today, -30)
    const sixMonthsAgo = addDays(today, -180)

    const recentOverdue = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(oneMonthAgo),
    })
    const oldOverdue = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(sixMonthsAgo),
    })

    await repository.save(recentOverdue)
    await repository.save(oldOverdue)

    const result = await getOverdueCheckIns.execute()

    expect(result.size).toBe(2)
    const ids = result.toArray().map((c) => c.id)
    expect(ids).toContain(recentOverdue.id)
    expect(ids).toContain(oldOverdue.id)
  })
})
