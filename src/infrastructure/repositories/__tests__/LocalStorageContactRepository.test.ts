import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageContactRepository } from '../LocalStorageContactRepository'
import {
  createContact,
  createContactId,
  createPhoneNumber,
  createEmailAddress,
} from '../../../domain/contact'
import { InMemoryStorageAdapter } from '../../storage/InMemoryStorageAdapter'
import { JsonSerializer } from '../../storage/JsonSerializer'

describe('LocalStorageContactRepository', () => {
  let repository: LocalStorageContactRepository
  let storage: InMemoryStorageAdapter
  let serializer: JsonSerializer

  beforeEach(() => {
    storage = new InMemoryStorageAdapter()
    serializer = new JsonSerializer()
    repository = new LocalStorageContactRepository(storage, serializer)
  })

  describe('save', () => {
    it('should save a contact to storage', async () => {
      // Given
      const contact = createContact({
        id: createContactId(),
        name: 'John Doe',
        phone: createPhoneNumber('+1234567890'),
        email: createEmailAddress('john@example.com'),
      })

      // When
      await repository.save(contact)

      // Then
      const stored = storage.getItem('contacts')
      expect(stored).not.toBeNull()
    })

    it('should update existing contact when saving with same ID', async () => {
      // Given
      const contact = createContact({
        id: createContactId(),
        name: 'John Doe',
        phone: createPhoneNumber('+1234567890'),
        email: createEmailAddress('john@example.com'),
      })
      await repository.save(contact)

      const updated = { ...contact, name: 'Jane Doe' }

      // When
      await repository.save(updated)

      // Then
      const found = await repository.findById(contact.id)
      expect(found?.name).toBe('Jane Doe')
    })
  })

  describe('findById', () => {
    it('should return contact when found', async () => {
      // Given
      const contact = createContact({
        id: createContactId(),
        name: 'John Doe',
        phone: createPhoneNumber('+1234567890'),
        email: createEmailAddress('john@example.com'),
      })
      await repository.save(contact)

      // When
      const found = await repository.findById(contact.id)

      // Then
      expect(found).not.toBeNull()
      expect(found?.id).toBe(contact.id)
    })

    it('should return null when contact not found', async () => {
      // Given
      const nonExistentId = createContactId()

      // When
      const found = await repository.findById(nonExistentId)

      // Then
      expect(found).toBeNull()
    })
  })

  describe('findAll', () => {
    it('should return empty collection when no contacts exist', async () => {
      // When
      const collection = await repository.findAll()

      // Then
      expect(collection.size).toBe(0)
    })

    it('should return all contacts', async () => {
      // Given
      const contact1 = createContact({
        id: createContactId(),
        name: 'John Doe',
        phone: createPhoneNumber('+1234567890'),
        email: createEmailAddress('john@example.com'),
      })
      const contact2 = createContact({
        id: createContactId(),
        name: 'Jane Smith',
        phone: createPhoneNumber('+0987654321'),
        email: createEmailAddress('jane@example.com'),
      })
      await repository.save(contact1)
      await repository.save(contact2)

      // When
      const collection = await repository.findAll()

      // Then
      expect(collection.size).toBe(2)
    })
  })

  describe('delete', () => {
    it('should remove contact from storage', async () => {
      // Given
      const contact = createContact({
        id: createContactId(),
        name: 'John Doe',
        phone: createPhoneNumber('+1234567890'),
        email: createEmailAddress('john@example.com'),
      })
      await repository.save(contact)

      // When
      await repository.delete(contact.id)

      // Then
      const found = await repository.findById(contact.id)
      expect(found).toBeNull()
    })

    it('should not throw when deleting non-existent contact', async () => {
      // Given
      const nonExistentId = createContactId()

      // When/Then
      await expect(repository.delete(nonExistentId)).resolves.not.toThrow()
    })
  })

  describe('search', () => {
    it('should return contacts matching name', async () => {
      // Given
      const contact1 = createContact({
        id: createContactId(),
        name: 'John Doe',
        phone: createPhoneNumber('+1234567890'),
        email: createEmailAddress('john@example.com'),
      })
      const contact2 = createContact({
        id: createContactId(),
        name: 'Jane Smith',
        phone: createPhoneNumber('+0987654321'),
        email: createEmailAddress('jane@example.com'),
      })
      await repository.save(contact1)
      await repository.save(contact2)

      // When
      const results = await repository.search('John')

      // Then
      expect(results.size).toBe(1)
      expect(results.toArray()[0].name).toBe('John Doe')
    })

    it('should return contacts matching email', async () => {
      // Given
      const contact = createContact({
        id: createContactId(),
        name: 'John Doe',
        phone: createPhoneNumber('+1234567890'),
        email: createEmailAddress('john@example.com'),
      })
      await repository.save(contact)

      // When
      const results = await repository.search('john@example')

      // Then
      expect(results.size).toBe(1)
    })

    it('should return contacts matching phone number', async () => {
      // Given
      const contact = createContact({
        id: createContactId(),
        name: 'John Doe',
        phone: createPhoneNumber('+1234567890'),
        email: createEmailAddress('john@example.com'),
      })
      await repository.save(contact)

      // When
      const results = await repository.search('1234567890')

      // Then
      expect(results.size).toBe(1)
    })

    it('should perform case-insensitive search', async () => {
      // Given
      const contact = createContact({
        id: createContactId(),
        name: 'John Doe',
        phone: createPhoneNumber('+1234567890'),
        email: createEmailAddress('john@example.com'),
      })
      await repository.save(contact)

      // When
      const results = await repository.search('JOHN')

      // Then
      expect(results.size).toBe(1)
    })

    it('should return empty collection when no matches found', async () => {
      // Given
      const contact = createContact({
        id: createContactId(),
        name: 'John Doe',
        phone: createPhoneNumber('+1234567890'),
        email: createEmailAddress('john@example.com'),
      })
      await repository.save(contact)

      // When
      const results = await repository.search('nonexistent')

      // Then
      expect(results.size).toBe(0)
    })
  })
})
