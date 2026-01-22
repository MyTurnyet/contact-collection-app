import { describe, it, expect } from 'vitest'
import { createCheckInCollection } from '../collections/CheckInCollection'
import { createCheckIn } from '../CheckIn'
import { createCheckInId } from '../CheckInId'
import { createContactId } from '../../contact'
import { createScheduledDate } from '../ScheduledDate'
import { CheckInStatus } from '../CheckInStatus'

describe('CheckInCollection', () => {
  it('should create empty collection', () => {
    const collection = createCheckInCollection([])

    expect(collection.size).toBe(0)
    expect(collection.isEmpty()).toBe(true)
  })

  it('should create collection with check-ins', () => {
    const checkIn1 = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2024-12-25')),
    })
    const checkIn2 = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2024-12-26')),
    })

    const collection = createCheckInCollection([checkIn1, checkIn2])

    expect(collection.size).toBe(2)
    expect(collection.isEmpty()).toBe(false)
  })

  it('should filter check-ins by status', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7)

    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 7)

    const scheduled = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(futureDate),
    })
    const overdue = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(pastDate),
    })

    const collection = createCheckInCollection([scheduled, overdue])
    const overdueCheckIns = collection.filter(
      (checkIn) => checkIn.status === CheckInStatus.Overdue
    )

    expect(overdueCheckIns.size).toBe(1)
    expect(overdueCheckIns.toArray()[0].status).toBe(CheckInStatus.Overdue)
  })

  it('should find check-in by id', () => {
    const id = createCheckInId()
    const checkIn = createCheckIn({
      id,
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2024-12-25')),
    })
    const collection = createCheckInCollection([checkIn])

    const found = collection.find((c) => c.id === id)

    expect(found).toBe(checkIn)
  })

  it('should return undefined when check-in not found', () => {
    const collection = createCheckInCollection([])

    const found = collection.find((c) => c.id === createCheckInId())

    expect(found).toBeUndefined()
  })

  it('should be immutable', () => {
    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2024-12-25')),
    })
    const collection = createCheckInCollection([checkIn])

    const items = collection.toArray()

    expect(Object.isFrozen(items)).toBe(true)
  })

  it('should map check-ins to ids', () => {
    const id1 = createCheckInId()
    const id2 = createCheckInId()
    const checkIn1 = createCheckIn({
      id: id1,
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2024-12-25')),
    })
    const checkIn2 = createCheckIn({
      id: id2,
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2024-12-26')),
    })

    const collection = createCheckInCollection([checkIn1, checkIn2])
    const ids = collection.map((c) => c.id)

    expect(ids).toEqual([id1, id2])
  })
})
