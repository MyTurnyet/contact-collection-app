import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteContact } from '../DeleteContact'
import { InMemoryContactRepository } from '../test-doubles/InMemoryContactRepository'
import { CreateContact } from '../CreateContact'
import { createContactId } from '../../../domain/contact'

describe('DeleteContact', () => {
  let repository: InMemoryContactRepository
  let deleteContact: DeleteContact
  let createContact: CreateContact

  beforeEach(() => {
    repository = new InMemoryContactRepository()
    deleteContact = new DeleteContact(repository)
    createContact = new CreateContact(repository)
  })

  it('should delete a contact by id', async () => {
    const contact = await createContact.execute({ name: 'John Doe' })

    await deleteContact.execute(contact.id)
    const found = await repository.findById(contact.id)

    expect(found).toBeNull()
  })

  it('should not throw error when deleting non-existent contact', async () => {
    await expect(deleteContact.execute(createContactId())).resolves.not.toThrow()
  })

  it('should delete the correct contact when multiple exist', async () => {
    const contact1 = await createContact.execute({ name: 'Alice' })
    const contact2 = await createContact.execute({ name: 'Bob' })
    const contact3 = await createContact.execute({ name: 'Charlie' })

    await deleteContact.execute(contact2.id)

    const found1 = await repository.findById(contact1.id)
    const found2 = await repository.findById(contact2.id)
    const found3 = await repository.findById(contact3.id)

    expect(found1).toBeDefined()
    expect(found2).toBeNull()
    expect(found3).toBeDefined()
  })

  it('should reduce total contacts count after deletion', async () => {
    await createContact.execute({ name: 'Alice' })
    await createContact.execute({ name: 'Bob' })
    await createContact.execute({ name: 'Charlie' })

    let contacts = await repository.findAll()
    expect(contacts.size).toBe(3)

    const contact = await createContact.execute({ name: 'David' })
    await deleteContact.execute(contact.id)

    contacts = await repository.findAll()
    expect(contacts.size).toBe(3)
  })

  it('should allow re-deletion of already deleted contact', async () => {
    const contact = await createContact.execute({ name: 'John Doe' })

    await deleteContact.execute(contact.id)
    await expect(deleteContact.execute(contact.id)).resolves.not.toThrow()

    const found = await repository.findById(contact.id)
    expect(found).toBeNull()
  })
})
