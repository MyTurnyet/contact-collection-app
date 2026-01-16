import { describe, it, expect } from 'vitest'
import { createContact, contactEquals } from '../Contact'
import { createContactId } from '../ContactId'
import { createPhoneNumber } from '../PhoneNumber'
import { createEmailAddress } from '../EmailAddress'
import { createLocation } from '../Location'
import { createRelationshipContext } from '../RelationshipContext'
import { createImportantDate } from '../ImportantDate'
import { createImportantDateCollection } from '../collections/ImportantDateCollection'

describe('Contact', () => {
  describe('createContact', () => {
    it('should create Contact with only name', () => {
      const contact = createContact({
        id: createContactId(),
        name: 'John Doe',
      })

      expect(contact).toBeDefined()
      expect(contact.name).toBe('John Doe')
      expect(contact.phone).toBeUndefined()
      expect(contact.email).toBeUndefined()
    })

    it('should create Contact with all fields', () => {
      const contact = createContact({
        id: createContactId(),
        name: 'John Doe',
        phone: createPhoneNumber('555-123-4567'),
        email: createEmailAddress('john@example.com'),
        location: createLocation({
          city: 'New York',
          state: 'NY',
          country: 'USA',
          timezone: 'America/New_York',
        }),
        relationshipContext: createRelationshipContext('College friend'),
      })

      expect(contact).toBeDefined()
      expect(contact.name).toBe('John Doe')
      expect(contact.phone).toBe('+15551234567')
      expect(contact.email).toBe('john@example.com')
    })

    it('should create Contact with important dates', () => {
      const birthday = createImportantDate({
        date: new Date('1990-05-15'),
        description: 'Birthday',
      })

      const contact = createContact({
        id: createContactId(),
        name: 'Jane Smith',
        phone: createPhoneNumber('555-987-6543'),
        email: createEmailAddress('jane@example.com'),
        location: createLocation({
          city: 'Seattle',
          state: 'WA',
          country: 'USA',
          timezone: 'America/Los_Angeles',
        }),
        relationshipContext: createRelationshipContext('Family'),
        importantDates: createImportantDateCollection([birthday]),
      })

      expect(contact.importantDates.size).toBe(1)
      expect(contact.importantDates.isEmpty()).toBe(false)
    })

    it('should create Contact without important dates', () => {
      const contact = createContact({
        id: createContactId(),
        name: 'Bob Johnson',
        phone: createPhoneNumber('555-111-2222'),
        email: createEmailAddress('bob@example.com'),
      })

      expect(contact.importantDates.isEmpty()).toBe(true)
      expect(contact.importantDates.size).toBe(0)
    })

    it('should throw error for empty name', () => {
      expect(() =>
        createContact({
          id: createContactId(),
          name: '',
        })
      ).toThrow('Name is required')
    })

    it('should trim whitespace from name', () => {
      const contact = createContact({
        id: createContactId(),
        name: '  Alice Williams  ',
      })

      expect(contact.name).toBe('Alice Williams')
    })

    it('should create immutable Contact', () => {
      const contact = createContact({
        id: createContactId(),
        name: 'Test User',
      })

      expect(() => {
        // @ts-expect-error - Testing immutability
        contact.name = 'New Name'
      }).toThrow()
    })
  })
})

  describe("contactEquals", () => {
    it("should return true for same contacts with all fields", () => {
      const id = createContactId()
      const importantDates = createImportantDateCollection([])
      const contact1 = createContact({
        id,
        name: "John Doe",
        phone: createPhoneNumber("555-123-4567"),
        email: createEmailAddress("john@example.com"),
        location: createLocation({
          city: "New York",
          country: "USA",
          timezone: "America/New_York",
        }),
        relationshipContext: createRelationshipContext("Friend"),
        importantDates,
      })
      const contact2 = createContact({
        id,
        name: "John Doe",
        phone: createPhoneNumber("555-123-4567"),
        email: createEmailAddress("john@example.com"),
        location: createLocation({
          city: "New York",
          country: "USA",
          timezone: "America/New_York",
        }),
        relationshipContext: createRelationshipContext("Friend"),
        importantDates,
      })

      expect(contactEquals(contact1, contact2)).toBe(true)
    })

    it("should return true for same contacts with only name", () => {
      const id = createContactId()
      const importantDates = createImportantDateCollection([])
      const contact1 = createContact({
        id,
        name: "John Doe",
        importantDates,
      })
      const contact2 = createContact({
        id,
        name: "John Doe",
        importantDates,
      })

      expect(contactEquals(contact1, contact2)).toBe(true)
    })

    it("should return false for different contact names", () => {
      const id = createContactId()
      const contact1 = createContact({
        id,
        name: "John Doe",
      })
      const contact2 = createContact({
        id,
        name: "Jane Doe",
      })

      expect(contactEquals(contact1, contact2)).toBe(false)
    })

    it("should return false for different contact IDs", () => {
      const contact1 = createContact({
        id: createContactId(),
        name: "John Doe",
      })
      const contact2 = createContact({
        id: createContactId(),
        name: "John Doe",
      })

      expect(contactEquals(contact1, contact2)).toBe(false)
    })
  })
