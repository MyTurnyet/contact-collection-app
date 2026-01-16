import { describe, it, expect } from 'vitest'
import { createContact } from '../Contact'
import { createContactId } from '../ContactId'
import { createPhoneNumber } from '../PhoneNumber'
import { createEmailAddress } from '../EmailAddress'
import { createLocation } from '../Location'
import { createRelationshipContext } from '../RelationshipContext'
import { createImportantDate } from '../ImportantDate'
import { createImportantDateCollection } from '../ImportantDateCollection'

describe('Contact', () => {
  describe('createContact', () => {
    it('should create Contact with all required fields', () => {
      const contact = createContact({
        id: createContactId(),
        name: 'John Doe',
        phoneNumber: createPhoneNumber('555-123-4567'),
        emailAddress: createEmailAddress('john@example.com'),
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
    })

    it('should create Contact with important dates', () => {
      const birthday = createImportantDate({
        date: new Date('1990-05-15'),
        description: 'Birthday',
      })

      const contact = createContact({
        id: createContactId(),
        name: 'Jane Smith',
        phoneNumber: createPhoneNumber('555-987-6543'),
        emailAddress: createEmailAddress('jane@example.com'),
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
        phoneNumber: createPhoneNumber('555-111-2222'),
        emailAddress: createEmailAddress('bob@example.com'),
        location: createLocation({
          city: 'Austin',
          state: 'TX',
          country: 'USA',
          timezone: 'America/Chicago',
        }),
        relationshipContext: createRelationshipContext('Coworker'),
      })

      expect(contact.importantDates.isEmpty()).toBe(true)
      expect(contact.importantDates.size).toBe(0)
    })

    it('should throw error for empty name', () => {
      expect(() =>
        createContact({
          id: createContactId(),
          name: '',
          phoneNumber: createPhoneNumber('555-123-4567'),
          emailAddress: createEmailAddress('test@example.com'),
          location: createLocation({
            city: 'New York',
            country: 'USA',
            timezone: 'America/New_York',
          }),
          relationshipContext: createRelationshipContext('Friend'),
        })
      ).toThrow('Name is required')
    })

    it('should trim whitespace from name', () => {
      const contact = createContact({
        id: createContactId(),
        name: '  Alice Williams  ',
        phoneNumber: createPhoneNumber('555-333-4444'),
        emailAddress: createEmailAddress('alice@example.com'),
        location: createLocation({
          city: 'Boston',
          country: 'USA',
          timezone: 'America/New_York',
        }),
        relationshipContext: createRelationshipContext('Friend'),
      })

      expect(contact.name).toBe('Alice Williams')
    })

    it('should create immutable Contact', () => {
      const contact = createContact({
        id: createContactId(),
        name: 'Test User',
        phoneNumber: createPhoneNumber('555-555-5555'),
        emailAddress: createEmailAddress('test@example.com'),
        location: createLocation({
          city: 'Denver',
          country: 'USA',
          timezone: 'America/Denver',
        }),
        relationshipContext: createRelationshipContext('Acquaintance'),
      })

      expect(() => {
        // @ts-expect-error - Testing immutability
        contact.name = 'New Name'
      }).toThrow()
    })
  })
})
