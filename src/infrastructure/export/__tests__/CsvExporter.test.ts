import { describe, it, expect, beforeEach } from 'vitest'
import { CsvExporter } from '../CsvExporter'
import { InMemoryContactRepository } from '../../../application/contacts/test-doubles/InMemoryContactRepository'
import { createContact } from '../../../domain/contact/Contact'
import { createContactId } from '../../../domain/contact/ContactId'
import { createPhoneNumber } from '../../../domain/contact/PhoneNumber'
import { createEmailAddress } from '../../../domain/contact/EmailAddress'
import { createLocation } from '../../../domain/contact/Location'
import { createRelationshipContext } from '../../../domain/contact/RelationshipContext'

describe('CsvExporter', () => {
  let exporter: CsvExporter
  let contactRepo: InMemoryContactRepository

  beforeEach(() => {
    contactRepo = new InMemoryContactRepository()
    exporter = new CsvExporter(contactRepo)
  })

  describe('exportContacts', () => {
    it('should export CSV header when no contacts exist', async () => {
      // When
      const csv = await exporter.exportContacts()

      // Then
      expect(csv).toContain('Name,Phone,Email,City,State,Country,Timezone,Relationship')
    })

    it('should export single contact as CSV row', async () => {
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
      const csv = await exporter.exportContacts()

      // Then
      expect(csv).toContain('John Doe')
      expect(csv).toContain('+15551234567')
      expect(csv).toContain('john@example.com')
      expect(csv).toContain('New York')
      expect(csv).toContain('NY')
      expect(csv).toContain('USA')
      expect(csv).toContain('America/New_York')
      expect(csv).toContain('Friend')
    })

    it('should export multiple contacts', async () => {
      // Given
      const contact1 = createContact({
        id: createContactId(),
        name: 'Alice Smith',
        phone: createPhoneNumber('+1-555-111-2222'),
        email: createEmailAddress('alice@example.com'),
        location: createLocation({
          city: 'Boston',
          state: 'MA',
          country: 'USA',
          timezone: 'America/New_York',
        }),
        relationshipContext: createRelationshipContext('Colleague'),
      })
      const contact2 = createContact({
        id: createContactId(),
        name: 'Bob Johnson',
        phone: createPhoneNumber('+1-555-333-4444'),
        email: createEmailAddress('bob@example.com'),
        location: createLocation({
          city: 'Seattle',
          state: 'WA',
          country: 'USA',
          timezone: 'America/Los_Angeles',
        }),
        relationshipContext: createRelationshipContext('Family'),
      })
      await contactRepo.save(contact1)
      await contactRepo.save(contact2)

      // When
      const csv = await exporter.exportContacts()

      // Then
      const lines = csv.split('\n')
      expect(lines).toHaveLength(3) // header + 2 contacts
      expect(csv).toContain('Alice Smith')
      expect(csv).toContain('Bob Johnson')
    })

    it('should escape fields containing commas', async () => {
      // Given
      const contact = createContact({
        id: createContactId(),
        name: 'Doe, John',
        phone: createPhoneNumber('+1-555-555-6666'),
        email: createEmailAddress('john.doe@example.com'),
        location: createLocation({
          city: 'Portland',
          state: 'OR',
          country: 'USA',
          timezone: 'America/Los_Angeles',
        }),
        relationshipContext: createRelationshipContext('Friend from college, roommate'),
      })
      await contactRepo.save(contact)

      // When
      const csv = await exporter.exportContacts()

      // Then
      expect(csv).toContain('"Doe, John"')
      expect(csv).toContain('"Friend from college, roommate"')
    })

    it('should escape fields containing quotes', async () => {
      // Given
      const contact = createContact({
        id: createContactId(),
        name: 'John "Johnny" Doe',
        phone: createPhoneNumber('+1-555-777-8888'),
        email: createEmailAddress('johnny@example.com'),
        location: createLocation({
          city: 'Denver',
          state: 'CO',
          country: 'USA',
          timezone: 'America/Denver',
        }),
        relationshipContext: createRelationshipContext('Friend'),
      })
      await contactRepo.save(contact)

      // When
      const csv = await exporter.exportContacts()

      // Then
      expect(csv).toContain('"John ""Johnny"" Doe"')
    })

    it('should handle newlines in fields', async () => {
      // Given
      const contact = createContact({
        id: createContactId(),
        name: 'Jane Doe',
        phone: createPhoneNumber('+1-555-999-0000'),
        email: createEmailAddress('jane@example.com'),
        location: createLocation({
          city: 'Austin',
          state: 'TX',
          country: 'USA',
          timezone: 'America/Chicago',
        }),
        relationshipContext: createRelationshipContext('Met at conference\nBecame good friends'),
      })
      await contactRepo.save(contact)

      // When
      const csv = await exporter.exportContacts()

      // Then
      expect(csv).toContain('"Met at conference\nBecame good friends"')
    })
  })
})
