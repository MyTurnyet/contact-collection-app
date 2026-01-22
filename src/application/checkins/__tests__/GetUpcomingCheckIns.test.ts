import { describe, it, expect, beforeEach } from 'vitest'
import { GetUpcomingCheckIns } from '../GetUpcomingCheckIns'
import { InMemoryCheckInRepository } from '../test-doubles/InMemoryCheckInRepository'
import {
  createCheckIn,
  createCheckInId,
  CheckInStatus,
} from '../../../domain/checkin'
import { createContactId } from '../../../domain/contact'
import { addDays } from 'date-fns'

describe('GetUpcomingCheckIns', () => {
  let repository: InMemoryCheckInRepository
  let getUpcomingCheckIns: GetUpcomingCheckIns

  beforeEach(() => {
    repository = new InMemoryCheckInRepository()
    getUpcomingCheckIns = new GetUpcomingCheckIns(repository)
  })

  it('should return check-ins scheduled in the next 7 days', async () => {
    const today = new Date()
    const in5Days = addDays(today, 5)
    const in10Days = addDays(today, 10)

    const checkIn1 = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: in5Days,
    })
    const checkIn2 = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: in10Days,
    })

    await repository.save(checkIn1)
    await repository.save(checkIn2)

    const result = await getUpcomingCheckIns.execute({ days: 7 })

    expect(result.size).toBe(1)
    expect(result.toArray()[0].id).toBe(checkIn1.id)
  })

  it('should return check-ins scheduled in the next 30 days', async () => {
    const today = new Date()
    const in5Days = addDays(today, 5)
    const in20Days = addDays(today, 20)
    const in40Days = addDays(today, 40)

    const checkIn1 = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: in5Days,
    })
    const checkIn2 = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: in20Days,
    })
    const checkIn3 = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: in40Days,
    })

    await repository.save(checkIn1)
    await repository.save(checkIn2)
    await repository.save(checkIn3)

    const result = await getUpcomingCheckIns.execute({ days: 30 })

    expect(result.size).toBe(2)
    const ids = result.toArray().map((c) => c.id)
    expect(ids).toContain(checkIn1.id)
    expect(ids).toContain(checkIn2.id)
    expect(ids).not.toContain(checkIn3.id)
  })

  it('should default to 7 days when days not specified', async () => {
    const today = new Date()
    const in5Days = addDays(today, 5)
    const in10Days = addDays(today, 10)

    const checkIn1 = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: in5Days,
    })
    const checkIn2 = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: in10Days,
    })

    await repository.save(checkIn1)
    await repository.save(checkIn2)

    const result = await getUpcomingCheckIns.execute({})

    expect(result.size).toBe(1)
  })

  it('should not include overdue check-ins', async () => {
    const today = new Date()
    const yesterday = addDays(today, -1)
    const tomorrow = addDays(today, 1)

    const overdueCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: yesterday,
    })
    const upcomingCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: tomorrow,
    })

    await repository.save(overdueCheckIn)
    await repository.save(upcomingCheckIn)

    const result = await getUpcomingCheckIns.execute({ days: 7 })

    expect(result.size).toBe(1)
    expect(result.toArray()[0].id).toBe(upcomingCheckIn.id)
  })

  it('should not include completed check-ins', async () => {
    const today = new Date()
    const tomorrow = addDays(today, 1)

    const completedCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: tomorrow,
      completionDate: today,
    })
    const scheduledCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: tomorrow,
    })

    await repository.save(completedCheckIn)
    await repository.save(scheduledCheckIn)

    const result = await getUpcomingCheckIns.execute({ days: 7 })

    expect(result.size).toBe(1)
    expect(result.toArray()[0].id).toBe(scheduledCheckIn.id)
    expect(result.toArray()[0].status).toBe(CheckInStatus.Scheduled)
  })

  it('should return empty collection when no upcoming check-ins', async () => {
    const today = new Date()
    const in40Days = addDays(today, 40)

    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: in40Days,
    })

    await repository.save(checkIn)

    const result = await getUpcomingCheckIns.execute({ days: 7 })

    expect(result.size).toBe(0)
  })

  it('should include check-ins scheduled for today', async () => {
    const today = new Date()

    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: today,
    })

    await repository.save(checkIn)

    const result = await getUpcomingCheckIns.execute({ days: 7 })

    expect(result.size).toBe(1)
    expect(result.toArray()[0].id).toBe(checkIn.id)
  })
})
