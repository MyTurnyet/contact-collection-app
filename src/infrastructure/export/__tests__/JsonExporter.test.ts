import { describe, it, expect, beforeEach } from 'vitest'
import { JsonExporter } from '../JsonExporter'
import { InMemoryContactRepository } from '../../../application/contacts/test-doubles/InMemoryContactRepository'
import { InMemoryCategoryRepository } from '../../../application/categories/test-doubles/InMemoryCategoryRepository'
import { InMemoryCheckInRepository } from '../../../application/checkins/test-doubles/InMemoryCheckInRepository'
import { createContact } from '../../../domain/contact/Contact'
import { createContactId } from '../../../domain/contact/ContactId'
import { createPhoneNumber } from '../../../domain/contact/PhoneNumber'
import { createEmailAddress } from '../../../domain/contact/EmailAddress'
import { createLocation } from '../../../domain/contact/Location'
import { createRelationshipContext } from '../../../domain/contact/RelationshipContext'
import { createCategory } from '../../../domain/category/Category'
import { createCategoryId } from '../../../domain/category/CategoryId'
import { createCategoryName } from '../../../domain/category/CategoryName'
import { createCheckInFrequency } from '../../../domain/category/CheckInFrequency'
import { createCheckIn } from '../../../domain/checkin/CheckIn'
import { createCheckInId } from '../../../domain/checkin/CheckInId'
import { createScheduledDate } from '../../../domain/checkin/ScheduledDate'

describe('JsonExporter', () => {
  let exporter: JsonExporter
  let contactRepo: InMemoryContactRepository
  let categoryRepo: InMemoryCategoryRepository
  let checkInRepo: InMemoryCheckInRepository

  beforeEach(() => {
    contactRepo = new InMemoryContactRepository()
    categoryRepo = new InMemoryCategoryRepository()
    checkInRepo = new InMemoryCheckInRepository()
    exporter = new JsonExporter(contactRepo, categoryRepo, checkInRepo)
  })

  describe('export', () => {
    it('should export empty data structure when no data exists', async () => {
      // When
      const result = await exporter.export()

      // Then
      expect(result.contacts).toEqual([])
      expect(result.categories).toEqual([])
      expect(result.checkIns).toEqual([])
      expect(result.exportedAt).toBeInstanceOf(Date)
      expect(result.version).toBe('1.0')
    })

    it('should export all contacts', async () => {
      // Given
      const contact = createContact({
        id: createContactId(),
        name: 'John Doe',
        phone: createPhoneNumber('+1-555-123-4567'),
        email: createEmailAddress('john@example.com'),
        location: createLocation({
          city: 'New York',
          state: 'NY',
          country: 'USA',
          timezone: 'America/New_York',
        }),
        relationshipContext: createRelationshipContext('Friend'),
      })
      await contactRepo.save(contact)

      // When
      const result = await exporter.export()

      // Then
      expect(result.contacts).toHaveLength(1)
      expect(result.contacts[0].name).toBe('John Doe')
    })

    it('should export all categories', async () => {
      // Given
      const category = createCategory({
        id: createCategoryId(),
        name: createCategoryName('Family'),
        frequency: createCheckInFrequency({ value: 1, unit: 'months' }),
      })
      await categoryRepo.save(category)

      // When
      const result = await exporter.export()

      // Then
      expect(result.categories).toHaveLength(1)
      expect(result.categories[0].name).toBe('Family')
    })

    it('should export all check-ins', async () => {
      // Given
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(new Date('2026-01-15T12:00:00')),
      })
      await checkInRepo.save(checkIn)

      // When
      const result = await exporter.export()

      // Then
      expect(result.checkIns).toHaveLength(1)
    })

    it('should include metadata in export', async () => {
      // When
      const result = await exporter.export()

      // Then
      expect(result.version).toBe('1.0')
      expect(result.exportedAt).toBeInstanceOf(Date)
    })
  })

  describe('exportAsString', () => {
    it('should export data as JSON string', async () => {
      // Given
      const contact = createContact({
        id: createContactId(),
        name: 'Jane Smith',
        phone: createPhoneNumber('+1-555-987-6543'),
        email: createEmailAddress('jane@example.com'),
        location: createLocation({
          city: 'Boston',
          state: 'MA',
          country: 'USA',
          timezone: 'America/New_York',
        }),
        relationshipContext: createRelationshipContext('Colleague'),
      })
      await contactRepo.save(contact)

      // When
      const jsonString = await exporter.exportAsString()

      // Then
      expect(typeof jsonString).toBe('string')
      const parsed = JSON.parse(jsonString)
      expect(parsed.contacts).toHaveLength(1)
      expect(parsed.contacts[0].name).toBe('Jane Smith')
    })

    it('should produce valid JSON that can be parsed', async () => {
      // When
      const jsonString = await exporter.exportAsString()

      // Then
      expect(() => JSON.parse(jsonString)).not.toThrow()
    })
  })
})
