import { describe, it, expect, beforeEach } from 'vitest'
import { SearchContacts } from '../SearchContacts'
import { InMemoryContactRepository } from '../test-doubles/InMemoryContactRepository'
import { CreateContact } from '../CreateContact'

describe('SearchContacts', () => {
  let repository: InMemoryContactRepository
  let searchContacts: SearchContacts
  let createContact: CreateContact

  beforeEach(() => {
    repository = new InMemoryContactRepository()
    searchContacts = new SearchContacts(repository)
    createContact = new CreateContact(repository)
  })

  it('should return empty collection when no matches found', async () => {
    await createContact.execute({ name: 'John Doe' })
    await createContact.execute({ name: 'Jane Smith' })

    const results = await searchContacts.execute('Charlie')

    expect(results.size).toBe(0)
  })

  it('should find contacts by partial name match', async () => {
    await createContact.execute({ name: 'John Doe' })
    await createContact.execute({ name: 'Jane Doe' })
    await createContact.execute({ name: 'Bob Smith' })

    const results = await searchContacts.execute('Doe')

    expect(results.size).toBe(2)
  })

  it('should be case insensitive when searching', async () => {
    await createContact.execute({ name: 'John Doe' })
    await createContact.execute({ name: 'Jane Smith' })

    const results = await searchContacts.execute('john')

    expect(results.size).toBe(1)
    expect(results.toArray()[0].name).toBe('John Doe')
  })

  it('should search by email address', async () => {
    await createContact.execute({ name: 'Alice', email: 'alice@example.com' })
    await createContact.execute({ name: 'Bob', email: 'bob@test.com' })
    await createContact.execute({ name: 'Charlie', email: 'charlie@example.com' })

    const results = await searchContacts.execute('example')

    expect(results.size).toBe(2)
  })

  it('should find contact matching either name or email', async () => {
    await createContact.execute({ name: 'John Smith', email: 'john@example.com' })
    await createContact.execute({ name: 'Jane Example', email: 'jane@test.com' })

    const results = await searchContacts.execute('example')

    expect(results.size).toBe(2)
  })

  it('should return all contacts when search query is empty', async () => {
    await createContact.execute({ name: 'Alice' })
    await createContact.execute({ name: 'Bob' })
    await createContact.execute({ name: 'Charlie' })

    const results = await searchContacts.execute('')

    expect(results.size).toBe(3)
  })

  it('should handle special characters in search query', async () => {
    await createContact.execute({ name: "O'Brien" })
    await createContact.execute({ name: 'Smith' })

    const results = await searchContacts.execute("O'Brien")

    expect(results.size).toBe(1)
    expect(results.toArray()[0].name).toBe("O'Brien")
  })
})
