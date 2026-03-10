import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteCheckIn } from '../DeleteCheckIn'
import { InMemoryCheckInRepository } from '../test-doubles/InMemoryCheckInRepository'
import {
  createCheckIn,
  createCheckInId,
  createScheduledDate,
  CheckInStatus,
} from '../../../domain/checkin'
import { createContactId } from '../../../domain/contact/ContactId'

describe('DeleteCheckIn', () => {
  let checkInRepository: InMemoryCheckInRepository
  let deleteCheckIn: DeleteCheckIn

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    deleteCheckIn = new DeleteCheckIn(checkInRepository)
  })

  it('should delete check-in from repository', async () => {
    // Given
    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2026-03-15')),
    })
    await checkInRepository.save(checkIn)

    // When
    await deleteCheckIn.execute(checkIn.id)

    // Then
    const deleted = await checkInRepository.findById(checkIn.id)
    expect(deleted).toBeNull()
  })

  it('should allow deleting scheduled check-in', async () => {
    // Given
    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2026-03-15')),
    })
    await checkInRepository.save(checkIn)
    expect(checkIn.status).toBe(CheckInStatus.Scheduled)

    // When & Then
    await expect(deleteCheckIn.execute(checkIn.id)).resolves.not.toThrow()
  })

  it('should allow deleting overdue check-in', async () => {
    // Given
    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2026-01-01')),
    })
    await checkInRepository.save(checkIn)
    expect(checkIn.status).toBe(CheckInStatus.Overdue)

    // When & Then
    await expect(deleteCheckIn.execute(checkIn.id)).resolves.not.toThrow()
  })

  it('should throw error when check-in not found', async () => {
    // Given
    const nonExistentId = createCheckInId()

    // When & Then
    await expect(deleteCheckIn.execute(nonExistentId)).rejects.toThrow(
      'CheckIn not found'
    )
  })
})
