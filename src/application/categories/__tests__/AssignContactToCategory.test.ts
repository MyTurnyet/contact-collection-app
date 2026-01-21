import { describe, it, expect, beforeEach } from 'vitest'
import { AssignContactToCategory } from '../AssignContactToCategory'
import { InMemoryCategoryRepository } from '../test-doubles/InMemoryCategoryRepository'
import { InMemoryContactRepository } from '../../contacts/test-doubles/InMemoryContactRepository'
import { CreateContact } from '../../contacts/CreateContact'
import { CreateCategory } from '../CreateCategory'
import { createContactId, isNullCategoryId } from '../../../domain/contact'

describe('AssignContactToCategory', () => {
  let categoryRepository: InMemoryCategoryRepository
  let contactRepository: InMemoryContactRepository
  let assignContactToCategory: AssignContactToCategory
  let createContact: CreateContact
  let createCategory: CreateCategory

  beforeEach(() => {
    categoryRepository = new InMemoryCategoryRepository()
    contactRepository = new InMemoryContactRepository()
    assignContactToCategory = new AssignContactToCategory(
      contactRepository,
      categoryRepository
    )
    createContact = new CreateContact(contactRepository)
    createCategory = new CreateCategory(categoryRepository)
  })

  it('should assign a category to a contact', async () => {
    const contact = await createContact.execute({ name: 'John Doe' })
    const category = await createCategory.execute({
      name: 'Family',
      frequencyValue: 1,
      frequencyUnit: 'weeks',
    })

    const updatedContact = await assignContactToCategory.execute({
      contactId: contact.id,
      categoryId: category.id,
    })

    expect(updatedContact.categoryId).toBe(category.id)
    expect(isNullCategoryId(updatedContact.categoryId)).toBe(false)
  })

  it('should preserve other contact fields', async () => {
    const contact = await createContact.execute({
      name: 'Jane Smith',
      phone: '+1-555-123-4567',
      email: 'jane@example.com',
    })
    const category = await createCategory.execute({
      name: 'Friends',
      frequencyValue: 2,
      frequencyUnit: 'weeks',
    })

    const updatedContact = await assignContactToCategory.execute({
      contactId: contact.id,
      categoryId: category.id,
    })

    expect(updatedContact.name).toBe('Jane Smith')
    expect(updatedContact.phone).toBe('+15551234567')
    expect(updatedContact.email).toBe('jane@example.com')
  })

  it('should update contact in repository', async () => {
    const contact = await createContact.execute({ name: 'Bob Johnson' })
    const category = await createCategory.execute({
      name: 'Colleagues',
      frequencyValue: 1,
      frequencyUnit: 'months',
    })

    await assignContactToCategory.execute({
      contactId: contact.id,
      categoryId: category.id,
    })

    const savedContact = await contactRepository.findById(contact.id)
    expect(savedContact?.categoryId).toBe(category.id)
  })

  it('should throw error if contact not found', async () => {
    const nonExistentContactId = createContactId()
    const category = await createCategory.execute({
      name: 'Family',
      frequencyValue: 1,
      frequencyUnit: 'weeks',
    })

    await expect(
      assignContactToCategory.execute({
        contactId: nonExistentContactId,
        categoryId: category.id,
      })
    ).rejects.toThrow('Contact not found')
  })

  it('should throw error if category not found', async () => {
    const contact = await createContact.execute({ name: 'Alice Brown' })
    const nonExistentCategoryId = await createCategory.execute({
      name: 'Test',
      frequencyValue: 1,
      frequencyUnit: 'weeks',
    })

    await categoryRepository.delete(nonExistentCategoryId.id)

    await expect(
      assignContactToCategory.execute({
        contactId: contact.id,
        categoryId: nonExistentCategoryId.id,
      })
    ).rejects.toThrow('Category not found')
  })

  it('should allow reassigning to different category', async () => {
    const contact = await createContact.execute({ name: 'Charlie Davis' })
    const category1 = await createCategory.execute({
      name: 'Family',
      frequencyValue: 1,
      frequencyUnit: 'weeks',
    })
    const category2 = await createCategory.execute({
      name: 'Friends',
      frequencyValue: 2,
      frequencyUnit: 'weeks',
    })

    await assignContactToCategory.execute({
      contactId: contact.id,
      categoryId: category1.id,
    })

    const updatedContact = await assignContactToCategory.execute({
      contactId: contact.id,
      categoryId: category2.id,
    })

    expect(updatedContact.categoryId).toBe(category2.id)
  })
})
