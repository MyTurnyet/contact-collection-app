import { describe, it, expect, beforeEach } from 'vitest'
import { JsonImporter } from '../JsonImporter'
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
import type { ExportData } from '../ExportService'

describe('JsonImporter', () => {
  let importer: JsonImporter
  let contactRepo: InMemoryContactRepository
  let categoryRepo: InMemoryCategoryRepository
  let checkInRepo: InMemoryCheckInRepository

  beforeEach(() => {
    contactRepo = new InMemoryContactRepository()
    categoryRepo = new InMemoryCategoryRepository()
    checkInRepo = new InMemoryCheckInRepository()
    importer = new JsonImporter(contactRepo, categoryRepo, checkInRepo)
  })

  describe('import', () => {
    it('should import empty data successfully', async () => {
      // Given
      const data: ExportData = {
        contacts: [],
        categories: [],
        checkIns: [],
        version: '1.0',
        exportedAt: new Date(),
      }

      // When
      await importer.import(data)

      // Then
      const contacts = await contactRepo.findAll()
      expect(contacts.toArray()).toHaveLength(0)
    })

    it('should import contacts', async () => {
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
      const data: ExportData = {
        contacts: [contact],
        categories: [],
        checkIns: [],
        version: '1.0',
        exportedAt: new Date(),
      }

      // When
      await importer.import(data)

      // Then
      const contacts = await contactRepo.findAll()
      expect(contacts.toArray()).toHaveLength(1)
      expect(contacts.toArray()[0].name).toBe('John Doe')
    })

    it('should import categories', async () => {
      // Given
      const category = createCategory({
        id: createCategoryId(),
        name: createCategoryName('Family'),
        frequency: createCheckInFrequency({ value: 1, unit: 'months' }),
      })
      const data: ExportData = {
        contacts: [],
        categories: [category],
        checkIns: [],
        version: '1.0',
        exportedAt: new Date(),
      }

      // When
      await importer.import(data)

      // Then
      const categories = await categoryRepo.findAll()
      expect(categories.toArray()).toHaveLength(1)
      expect(categories.toArray()[0].name).toBe('Family')
    })

    it('should import check-ins', async () => {
      // Given
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(new Date('2026-01-15T12:00:00')),
      })
      const data: ExportData = {
        contacts: [],
        categories: [],
        checkIns: [checkIn],
        version: '1.0',
        exportedAt: new Date(),
      }

      // When
      await importer.import(data)

      // Then
      const checkIns = await checkInRepo.findAll()
      expect(checkIns.toArray()).toHaveLength(1)
    })

    it('should import all data types together', async () => {
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
      const category = createCategory({
        id: createCategoryId(),
        name: createCategoryName('Work'),
        frequency: createCheckInFrequency({ value: 2, unit: 'weeks' }),
      })
      const checkIn = createCheckIn({
        id: createCheckInId(),
        contactId: contact.id,
        scheduledDate: createScheduledDate(new Date('2026-01-20T12:00:00')),
      })
      const data: ExportData = {
        contacts: [contact],
        categories: [category],
        checkIns: [checkIn],
        version: '1.0',
        exportedAt: new Date(),
      }

      // When
      await importer.import(data)

      // Then
      const contacts = await contactRepo.findAll()
      const categories = await categoryRepo.findAll()
      const checkIns = await checkInRepo.findAll()
      expect(contacts.toArray()).toHaveLength(1)
      expect(categories.toArray()).toHaveLength(1)
      expect(checkIns.toArray()).toHaveLength(1)
    })
  })

  describe('importFromString', () => {
    it('should import from JSON string', async () => {
      // Given
      const contact = createContact({
        id: createContactId(),
        name: 'Test User',
        phone: createPhoneNumber('+1-555-111-2222'),
        email: createEmailAddress('test@example.com'),
        location: createLocation({
          city: 'Seattle',
          state: 'WA',
          country: 'USA',
          timezone: 'America/Los_Angeles',
        }),
        relationshipContext: createRelationshipContext('Friend'),
      })
      const data: ExportData = {
        contacts: [contact],
        categories: [],
        checkIns: [],
        version: '1.0',
        exportedAt: new Date(),
      }
      const jsonString = JSON.stringify(data)

      // When
      await importer.importFromString(jsonString)

      // Then
      const contacts = await contactRepo.findAll()
      expect(contacts.toArray()).toHaveLength(1)
    })

    it('should throw error for invalid JSON', async () => {
      // Given
      const invalidJson = 'not valid json'

      // When/Then
      await expect(importer.importFromString(invalidJson)).rejects.toThrow()
    })

    it('should throw error for missing version', async () => {
      // Given
      const invalidData = JSON.stringify({
        contacts: [],
        categories: [],
        checkIns: [],
      })

      // When/Then
      await expect(importer.importFromString(invalidData)).rejects.toThrow(
        'Invalid import data: missing version'
      )
    })

    it('should throw error for missing contacts array', async () => {
      // Given
      const invalidData = JSON.stringify({
        categories: [],
        checkIns: [],
        version: '1.0',
      })

      // When/Then
      await expect(importer.importFromString(invalidData)).rejects.toThrow(
        'Invalid import data: missing contacts array'
      )
    })

    it('should throw error for missing categories array', async () => {
      // Given
      const invalidData = JSON.stringify({
        contacts: [],
        checkIns: [],
        version: '1.0',
      })

      // When/Then
      await expect(importer.importFromString(invalidData)).rejects.toThrow(
        'Invalid import data: missing categories array'
      )
    })

    it('should throw error for missing checkIns array', async () => {
      // Given
      const invalidData = JSON.stringify({
        contacts: [],
        categories: [],
        version: '1.0',
      })

      // When/Then
      await expect(importer.importFromString(invalidData)).rejects.toThrow(
        'Invalid import data: missing checkIns array'
      )
    })
  })
})
