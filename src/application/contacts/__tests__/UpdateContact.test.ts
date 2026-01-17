import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateContact } from '../UpdateContact'
import { InMemoryContactRepository } from '../test-doubles/InMemoryContactRepository'
import { createContact } from '../../../domain/contact/Contact'
import { createContactId } from '../../../domain/contact/ContactId'
import { createPhoneNumber } from '../../../domain/contact/PhoneNumber'
import { createEmailAddress } from '../../../domain/contact/EmailAddress'
import { createLocation } from '../../../domain/contact/Location'
import { createRelationshipContext } from '../../../domain/contact/RelationshipContext'

describe('UpdateContact', () => {
  let repository: InMemoryContactRepository
  let updateContact: UpdateContact

  beforeEach(() => {
    repository = new InMemoryContactRepository()
    updateContact = new UpdateContact(repository)
  })

  it('should update contact name', async () => {
    const contactId = createContactId()
    const existingContact = createContact({
      id: contactId,
      name: 'John Doe',
    })
    await repository.save(existingContact)

    const result = await updateContact.execute({
      id: contactId,
      name: 'Jane Doe',
    })

    expect(result.name).toBe('Jane Doe')
    expect(result.id).toBe(contactId)
  })

  it('should update contact phone', async () => {
    const contactId = createContactId()
    const existingContact = createContact({
      id: contactId,
      name: 'John Doe',
    })
    await repository.save(existingContact)

    const result = await updateContact.execute({
      id: contactId,
      phone: '+1-555-123-4567',
    })

    expect(result.phone).toBe('+15551234567')
    expect(result.name).toBe('John Doe')
  })

  it('should update contact email', async () => {
    const contactId = createContactId()
    const existingContact = createContact({
      id: contactId,
      name: 'John Doe',
    })
    await repository.save(existingContact)

    const result = await updateContact.execute({
      id: contactId,
      email: 'john@example.com',
    })

    expect(result.email).toBe('john@example.com')
    expect(result.name).toBe('John Doe')
  })

  it('should update contact location', async () => {
    const contactId = createContactId()
    const existingContact = createContact({
      id: contactId,
      name: 'John Doe',
    })
    await repository.save(existingContact)

    const result = await updateContact.execute({
      id: contactId,
      location: 'New York',
      country: 'USA',
      timezone: 'America/New_York',
    })

    expect(result.location.city).toBe('New York')
    expect(result.location.country).toBe('USA')
    expect(result.name).toBe('John Doe')
  })

  it('should update contact relationship context', async () => {
    const contactId = createContactId()
    const existingContact = createContact({
      id: contactId,
      name: 'John Doe',
    })
    await repository.save(existingContact)

    const result = await updateContact.execute({
      id: contactId,
      relationshipContext: 'College friend',
    })

    expect(result.relationshipContext).toBe('College friend')
    expect(result.name).toBe('John Doe')
  })

  it('should update multiple fields at once', async () => {
    const contactId = createContactId()
    const existingContact = createContact({
      id: contactId,
      name: 'John Doe',
    })
    await repository.save(existingContact)

    const result = await updateContact.execute({
      id: contactId,
      name: 'Jane Smith',
      phone: '+1-555-987-6543',
      email: 'jane@example.com',
      relationshipContext: 'Family',
    })

    expect(result.name).toBe('Jane Smith')
    expect(result.phone).toBe('+15559876543')
    expect(result.email).toBe('jane@example.com')
    expect(result.relationshipContext).toBe('Family')
  })

  it('should preserve unchanged fields', async () => {
    const contactId = createContactId()
    const existingContact = createContact({
      id: contactId,
      name: 'John Doe',
      phone: createPhoneNumber('+1-555-123-4567'),
      email: createEmailAddress('john@example.com'),
      location: createLocation({
        city: 'Boston',
        country: 'USA',
        timezone: 'America/New_York',
      }),
      relationshipContext: createRelationshipContext('Friend'),
    })
    await repository.save(existingContact)

    const result = await updateContact.execute({
      id: contactId,
      name: 'Jane Doe',
    })

    expect(result.name).toBe('Jane Doe')
    expect(result.phone).toBe('+15551234567')
    expect(result.email).toBe('john@example.com')
    expect(result.location.city).toBe('Boston')
    expect(result.relationshipContext).toBe('Friend')
  })

  it('should throw error if contact not found', async () => {
    const nonExistentId = createContactId()

    await expect(
      updateContact.execute({
        id: nonExistentId,
        name: 'Jane Doe',
      })
    ).rejects.toThrow('Contact not found')
  })

  it('should throw error for invalid phone number', async () => {
    const contactId = createContactId()
    const existingContact = createContact({
      id: contactId,
      name: 'John Doe',
    })
    await repository.save(existingContact)

    await expect(
      updateContact.execute({
        id: contactId,
        phone: 'invalid',
      })
    ).rejects.toThrow()
  })

  it('should throw error for invalid email', async () => {
    const contactId = createContactId()
    const existingContact = createContact({
      id: contactId,
      name: 'John Doe',
    })
    await repository.save(existingContact)

    await expect(
      updateContact.execute({
        id: contactId,
        email: 'not-an-email',
      })
    ).rejects.toThrow()
  })

  it('should save updated contact to repository', async () => {
    const contactId = createContactId()
    const existingContact = createContact({
      id: contactId,
      name: 'John Doe',
    })
    await repository.save(existingContact)

    await updateContact.execute({
      id: contactId,
      name: 'Jane Doe',
    })

    const savedContact = await repository.findById(contactId)
    expect(savedContact?.name).toBe('Jane Doe')
  })
})
