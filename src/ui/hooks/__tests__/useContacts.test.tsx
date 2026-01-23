import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useContacts } from '../useContacts'
import { DependencyProvider } from '../../../di'
import { DIContainer } from '../../../di/DIContainer'

describe('useContacts', () => {
  let container: DIContainer

  beforeEach(async () => {
    container = new DIContainer()
    // Clear localStorage before each test
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DependencyProvider container={container}>{children}</DependencyProvider>
  )

  describe('createContact', () => {
    it('should create a new contact', async () => {
      // Given
      const { result } = renderHook(() => useContacts(), { wrapper })

      // When
      const contact = await result.current.createContact({
        name: 'John Doe',
        phone: '+1-555-123-4567',
        email: 'john@example.com',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        timezone: 'America/New_York',
        relationshipContext: 'Friend from college',
      })

      // Then
      expect(contact.name).toBe('John Doe')
      expect(contact.phone).toBe('+15551234567')
    })
  })

  describe('getAllContacts', () => {
    it('should return all contacts', async () => {
      // Given
      const { result } = renderHook(() => useContacts(), { wrapper })
      await result.current.createContact({
        name: 'Jane Doe',
        phone: '+1-555-987-6543',
        email: 'jane@example.com',
        city: 'Boston',
        state: 'MA',
        country: 'USA',
        timezone: 'America/New_York',
        relationshipContext: 'Work colleague',
      })

      // When
      const contacts = await result.current.getAllContacts()

      // Then
      expect(contacts.length).toBe(1)
      expect(contacts[0].name).toBe('Jane Doe')
    })
  })

  describe('getContactById', () => {
    it('should return contact by id', async () => {
      // Given
      const { result } = renderHook(() => useContacts(), { wrapper })
      const created = await result.current.createContact({
        name: 'Bob Smith',
        phone: '+1-555-111-2222',
        email: 'bob@example.com',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        timezone: 'America/Chicago',
        relationshipContext: 'Family',
      })

      // When
      const found = await result.current.getContactById(created.id)

      // Then
      expect(found?.name).toBe('Bob Smith')
    })
  })

  describe('updateContact', () => {
    it('should update existing contact', async () => {
      // Given
      const { result } = renderHook(() => useContacts(), { wrapper })
      const created = await result.current.createContact({
        name: 'Alice Johnson',
        phone: '+1-555-333-4444',
        email: 'alice@example.com',
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
        timezone: 'America/Los_Angeles',
        relationshipContext: 'Friend',
      })

      // When
      const updated = await result.current.updateContact(created.id, {
        name: 'Alice Williams',
      })

      // Then
      expect(updated.name).toBe('Alice Williams')
      expect(updated.id).toBe(created.id)
    })
  })

  describe('deleteContact', () => {
    it('should delete contact', async () => {
      // Given
      const { result } = renderHook(() => useContacts(), { wrapper })
      const created = await result.current.createContact({
        name: 'Charlie Brown',
        phone: '+1-555-555-6666',
        email: 'charlie@example.com',
        city: 'Denver',
        state: 'CO',
        country: 'USA',
        timezone: 'America/Denver',
        relationshipContext: 'Neighbor',
      })

      // When
      await result.current.deleteContact(created.id)

      // Then
      const found = await result.current.getContactById(created.id)
      expect(found).toBeNull()
    })
  })

  describe('searchContacts', () => {
    it('should search contacts by query', async () => {
      // Given
      const { result } = renderHook(() => useContacts(), { wrapper })
      await result.current.createContact({
        name: 'David Lee',
        phone: '+1-555-777-8888',
        email: 'david@example.com',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        timezone: 'America/Chicago',
        relationshipContext: 'Client',
      })

      // When
      const results = await result.current.searchContacts('David')

      // Then
      expect(results.length).toBe(1)
      expect(results[0].name).toBe('David Lee')
    })
  })
})
