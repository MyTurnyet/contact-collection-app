import { describe, it, expect, beforeEach } from 'vitest'
import { DIContainer } from '../../di/DIContainer'

describe('Data Integrity Flow Integration', () => {
  let container: DIContainer

  beforeEach(() => {
    localStorage.clear()
    container = new DIContainer()
  })

  it('should export and import data maintaining integrity', async () => {
    // Given - Create some test data
    const createContact = container.getCreateContact()
    const createCategory = container.getCreateCategory()

    await createCategory.execute({
      name: 'Test Category',
      frequencyValue: 1,
      frequencyUnit: 'months',
    })

    await createContact.execute({
      name: 'Test Contact',
      email: 'test@example.com',
      phone: '5551234567',
      location: 'Test City',
      country: 'United States',
      timezone: 'America/New_York',
      relationshipContext: 'Friend',
    })

    // When - Export data
    const exporter = container.getJsonExporter()
    const exportedData = await exporter.export()

    // Then - Exported data contains our test data
    expect(exportedData.contacts.length).toBeGreaterThan(0)
    expect(exportedData.categories.length).toBeGreaterThan(0)

    // And - Clear all data
    localStorage.clear()

    // And - Import data back
    const importer = container.getJsonImporter()
    await importer.import(exportedData)

    // Then - Data is restored (create new container to avoid cache)
    const newContainer = new DIContainer()
    const listContacts = newContainer.getListAllContacts()
    const listCategories = newContainer.getListCategories()

    const contacts = await listContacts.execute()
    const categories = await listCategories.execute()

    expect(contacts.size).toBe(exportedData.contacts.length)
    expect(categories.size).toBe(exportedData.categories.length)
  })

  it('should maintain data consistency across operations', async () => {
    // Given - Create category
    const createCategory = container.getCreateCategory()
    await createCategory.execute({
      name: 'Friends',
      frequencyValue: 1,
      frequencyUnit: 'months',
    })

    // When - Create contact
    const createContact = container.getCreateContact()
    await createContact.execute({
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '5555678901',
      location: 'Boston',
      country: 'United States',
      timezone: 'America/New_York',
      relationshipContext: 'Friend',
    })

    // Then - Contact is created successfully
    const listContacts = container.getListAllContacts()
    const contacts = await listContacts.execute()

    const createdContact = contacts.find((c: { name: string }) => c.name === 'Jane Smith')
    expect(createdContact).toBeDefined()
    expect(createdContact?.name).toBe('Jane Smith')
  })
})
