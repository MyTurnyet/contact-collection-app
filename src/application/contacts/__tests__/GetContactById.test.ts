import { describe, it, expect, beforeEach } from 'vitest'
import { GetContactById } from '../GetContactById'
import { InMemoryContactRepository } from '../test-doubles/InMemoryContactRepository'
import { CreateContact } from '../CreateContact'
import { type ContactId, createContactId, isNullContact } from '../../../domain/contact'

describe('GetContactById', () => {
  let repository: InMemoryContactRepository
  let getContactById: GetContactById
  let createContact: CreateContact

  beforeEach(() => {
    repository = new InMemoryContactRepository()
    getContactById = new GetContactById(repository)
    createContact = new CreateContact(repository)
  })

  it('should retrieve a contact by id', async () => {
    const contactData = {
      name: 'John Doe',
      phone: '+1-555-123-4567',
      email: 'john@example.com',
    }

    const createdContact = await createContact.execute(contactData)
    const retrievedContact = await getContactById.execute(createdContact.id)

    expect(retrievedContact).toBeDefined()
    expect(retrievedContact.name).toBe('John Doe')
    expect(retrievedContact.phone).toBe('+15551234567')
    expect(retrievedContact.email).toBe('john@example.com')
  })

  it('should return null contact when contact does not exist', async () => {
    const id: ContactId = createContactId()
    const result = await getContactById.execute(id)

    expect(isNullContact(result)).toBe(true)
  })

  it('should retrieve contact with all fields', async () => {
    const contactData = {
      name: 'Jane Smith',
      phone: '+1-555-987-6543',
      email: 'jane@example.com',
      location: 'New York',
      country: 'USA',
      timezone: 'America/New_York',
      relationshipContext: 'College friend',
    }

    const createdContact = await createContact.execute(contactData)
    const retrievedContact = await getContactById.execute(createdContact.id)

    expect(retrievedContact).toBeDefined()
    expect(retrievedContact.name).toBe('Jane Smith')
    expect(retrievedContact.relationshipContext).toBe('College friend')
  })

  it('should retrieve the correct contact when multiple exist', async () => {
    await createContact.execute({ name: 'Alice' })
    const contact2 = await createContact.execute({ name: 'Bob' })
    await createContact.execute({ name: 'Charlie' })

    const retrieved = await getContactById.execute(contact2.id)

    expect(retrieved.name).toBe('Bob')
    expect(retrieved.id).toBe(contact2.id)
  })
})
