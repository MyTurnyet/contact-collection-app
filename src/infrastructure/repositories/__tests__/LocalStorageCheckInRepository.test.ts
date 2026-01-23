import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageCheckInRepository } from '../LocalStorageCheckInRepository'
import {
  createCheckIn,
  createCheckInId,
  createScheduledDate,
  CheckInStatus,
} from '../../../domain/checkin'
import { createContactId } from '../../../domain/contact'
import { createDateRange } from '../../../domain/shared'
import { InMemoryStorageAdapter } from '../../storage/InMemoryStorageAdapter'
import { JsonSerializer } from '../../storage/JsonSerializer'

describe('LocalStorageCheckInRepository', () => {
  let repository: LocalStorageCheckInRepository
  let storage: InMemoryStorageAdapter
  let serializer: JsonSerializer

  beforeEach(() => {
    storage = new InMemoryStorageAdapter()
    serializer = new JsonSerializer()
    repository = new LocalStorageCheckInRepository(storage, serializer)
  })

  describe('save', () => {
    it('should save a check-in to storage', async () => {
      // Given
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 30)
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(futureDate),
      })

      // When
      await repository.save(checkIn)

      // Then
      const stored = storage.getItem('checkins')
      expect(stored).not.toBeNull()
    })

    it('should update existing check-in when saving with same ID', async () => {
      // Given
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 30)
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(futureDate),
      })
      await repository.save(checkIn)

      const updated = { ...checkIn, status: CheckInStatus.Completed }

      // When
      await repository.save(updated)

      // Then
      const found = await repository.findById(checkIn.id)
      expect(found?.status).toBe(CheckInStatus.Completed)
    })
  })

  describe('findById', () => {
    it('should return check-in when found', async () => {
      // Given
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 30)
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(futureDate),
      })
      await repository.save(checkIn)

      // When
      const found = await repository.findById(checkIn.id)

      // Then
      expect(found).not.toBeNull()
      expect(found?.id).toBe(checkIn.id)
    })

    it('should return null when check-in not found', async () => {
      // Given
      const nonExistentId = createCheckInId()

      // When
      const found = await repository.findById(nonExistentId)

      // Then
      expect(found).toBeNull()
    })
  })

  describe('findAll', () => {
    it('should return empty collection when no check-ins exist', async () => {
      // When
      const collection = await repository.findAll()

      // Then
      expect(collection.size).toBe(0)
    })

    it('should return all check-ins', async () => {
      // Given
      const futureDate1 = new Date()
      futureDate1.setDate(futureDate1.getDate() + 30)
      const futureDate2 = new Date()
      futureDate2.setDate(futureDate2.getDate() + 60)

      const checkIn1 = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(futureDate1),
      })
      const checkIn2 = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(futureDate2),
      })
      await repository.save(checkIn1)
      await repository.save(checkIn2)

      // When
      const collection = await repository.findAll()

      // Then
      expect(collection.size).toBe(2)
    })
  })

  describe('findByContactId', () => {
    it('should return check-ins for specific contact', async () => {
      // Given
      const contactId1 = createContactId()
      const contactId2 = createContactId()
      const futureDate1 = new Date()
      futureDate1.setDate(futureDate1.getDate() + 30)
      const futureDate2 = new Date()
      futureDate2.setDate(futureDate2.getDate() + 60)

      const checkIn1 = createCheckIn({
        id: createCheckInId(),
        contactId: contactId1,
        scheduledDate: createScheduledDate(futureDate1),
      })
      const checkIn2 = createCheckIn({
        id: createCheckInId(),
        contactId: contactId2,
        scheduledDate: createScheduledDate(futureDate2),
      })
      await repository.save(checkIn1)
      await repository.save(checkIn2)

      // When
      const collection = await repository.findByContactId(contactId1)

      // Then
      expect(collection.size).toBe(1)
      expect(collection.toArray()[0].contactId).toBe(contactId1)
    })

    it('should return empty collection when no check-ins for contact', async () => {
      // Given
      const contactId = createContactId()

      // When
      const collection = await repository.findByContactId(contactId)

      // Then
      expect(collection.size).toBe(0)
    })
  })

  describe('findByStatus', () => {
    it('should return check-ins with specific status', async () => {
      // Given
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 30)

      const checkIn1 = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(futureDate),
      })
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 30)

      const checkIn2 = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(pastDate),
      })
      await repository.save(checkIn1)
      await repository.save(checkIn2)

      // When
      const collection = await repository.findByStatus(CheckInStatus.Scheduled)

      // Then
      expect(collection.size).toBe(1)
      expect(collection.toArray()[0].status).toBe(CheckInStatus.Scheduled)
    })

    it('should return empty collection when no check-ins with status', async () => {
      // When
      const collection = await repository.findByStatus(CheckInStatus.Overdue)

      // Then
      expect(collection.size).toBe(0)
    })
  })

  describe('findByDateRange', () => {
    it('should return check-ins within date range', async () => {
      // Given
      const today = new Date()
      const date1 = new Date(today)
      date1.setDate(date1.getDate() + 15)
      const date2 = new Date(today)
      date2.setDate(date2.getDate() + 25)
      const date3 = new Date(today)
      date3.setDate(date3.getDate() + 45)

      const checkIn1 = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(date1),
      })
      const checkIn2 = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(date2),
      })
      const checkIn3 = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(date3),
      })
      await repository.save(checkIn1)
      await repository.save(checkIn2)
      await repository.save(checkIn3)

      const rangeStart = new Date(today)
      rangeStart.setDate(rangeStart.getDate() + 1)
      const rangeEnd = new Date(today)
      rangeEnd.setDate(rangeEnd.getDate() + 31)

      const range = createDateRange(rangeStart, rangeEnd)

      // When
      const collection = await repository.findByDateRange(range)

      // Then
      expect(collection.size).toBe(2)
    })

    it('should return empty collection when no check-ins in range', async () => {
      // Given
      const today = new Date()
      const rangeStart = new Date(today)
      rangeStart.setDate(rangeStart.getDate() + 100)
      const rangeEnd = new Date(today)
      rangeEnd.setDate(rangeEnd.getDate() + 130)

      const range = createDateRange(rangeStart, rangeEnd)

      // When
      const collection = await repository.findByDateRange(range)

      // Then
      expect(collection.size).toBe(0)
    })
  })

  describe('delete', () => {
    it('should remove check-in from storage', async () => {
      // Given
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 30)
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(futureDate),
      })
      await repository.save(checkIn)

      // When
      await repository.delete(checkIn.id)

      // Then
      const found = await repository.findById(checkIn.id)
      expect(found).toBeNull()
    })

    it('should not throw when deleting non-existent check-in', async () => {
      // Given
      const nonExistentId = createCheckInId()

      // When/Then
      await expect(repository.delete(nonExistentId)).resolves.not.toThrow()
    })
  })
})
