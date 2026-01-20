import { describe, it, expect, beforeEach } from 'vitest'
import { ListAllContacts } from '../ListAllContacts'
import { InMemoryContactRepository } from '../test-doubles/InMemoryContactRepository'
import { CreateContact } from '../CreateContact'

describe('ListAllContacts', () => {
  let repository: InMemoryContactRepository
  let listAllContacts: ListAllContacts
  let createContact: CreateContact

  beforeEach(() => {
    repository = new InMemoryContactRepository()
    listAllContacts = new ListAllContacts(repository)
    createContact = new CreateContact(repository)
  })

  it('should return empty collection when no contacts exist', async () => {
    const contacts = await listAllContacts.execute()

    expect(contacts.size).toBe(0)
    expect(contacts.toArray()).toEqual([])
  })

  it('should return all contacts', async () => {
    await createContact.execute({ name: 'Alice' })
    await createContact.execute({ name: 'Bob' })
    await createContact.execute({ name: 'Charlie' })

    const contacts = await listAllContacts.execute()

    expect(contacts.size).toBe(3)
  })

  it('should return contacts with all their data', async () => {
    const contactData = {
      name: 'John Doe',
      phone: '+1-555-123-4567',
      email: 'john@example.com',
    }

    await createContact.execute(contactData)
    const contacts = await listAllContacts.execute()

    const contactArray = contacts.toArray()
    expect(contactArray[0].name).toBe('John Doe')
    expect(contactArray[0].phone).toBe('+15551234567')
    expect(contactArray[0].email).toBe('john@example.com')
  })

  it('should return updated collection after adding contacts', async () => {
    await createContact.execute({ name: 'Alice' })

    let contacts = await listAllContacts.execute()
    expect(contacts.size).toBe(1)

    await createContact.execute({ name: 'Bob' })
    contacts = await listAllContacts.execute()
    expect(contacts.size).toBe(2)
  })

  it('should handle multiple contacts with different fields', async () => {
    await createContact.execute({ name: 'Alice', email: 'alice@example.com' })
    await createContact.execute({ name: 'Bob', phone: '+1-555-111-2222' })
    await createContact.execute({ name: 'Charlie' })

    const contacts = await listAllContacts.execute()
    const contactArray = contacts.toArray()

    expect(contacts.size).toBe(3)
    expect(contactArray.some((c) => c.name === 'Alice')).toBe(true)
    expect(contactArray.some((c) => c.name === 'Bob')).toBe(true)
    expect(contactArray.some((c) => c.name === 'Charlie')).toBe(true)
  })
})
