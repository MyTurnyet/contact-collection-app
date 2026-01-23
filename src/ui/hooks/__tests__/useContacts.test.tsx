import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
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

  describe('state management', () => {
    it('should start with loading state', () => {
      // When
      const { result } = renderHook(() => useContacts(), { wrapper })

      // Then
      expect(result.current.isLoading).toBe(true)
      expect(result.current.contacts).toBeNull()
      expect(result.current.error).toBeNull()
    })

    it('should load contacts on mount', async () => {
      // When
      const { result } = renderHook(() => useContacts(), { wrapper })

      // Then
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.contacts).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('should update state after creating contact', async () => {
      // Given
      const { result } = renderHook(() => useContacts(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // When
      await result.current.operations.createContact({
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
      await waitFor(() => {
        expect(result.current.contacts?.length).toBe(1)
      })

      expect(result.current.contacts?.[0].name).toBe('John Doe')
    })

    it('should refresh contacts manually', async () => {
      // Given
      const { result } = renderHook(() => useContacts(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // When
      await result.current.operations.refresh()

      // Then
      expect(result.current.contacts).toEqual([])
      expect(result.current.error).toBeNull()
    })
  })

  describe('operations', () => {
    it('should create a new contact', async () => {
      // Given
      const { result } = renderHook(() => useContacts(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // When
      const contact = await result.current.operations.createContact({
        name: 'Jane Doe',
        phone: '+1-555-987-6543',
        email: 'jane@example.com',
        city: 'Boston',
        state: 'MA',
        country: 'USA',
        timezone: 'America/New_York',
        relationshipContext: 'Work colleague',
      })

      // Then
      expect(contact.name).toBe('Jane Doe')
      expect(contact.phone).toBe('+15559876543')
    })

    it('should update existing contact', async () => {
      // Given
      const { result } = renderHook(() => useContacts(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const created = await result.current.operations.createContact({
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
      const updated = await result.current.operations.updateContact(created.id, {
        name: 'Alice Williams',
      })

      // Then
      expect(updated.name).toBe('Alice Williams')
      expect(updated.id).toBe(created.id)
    })

    it('should delete contact', async () => {
      // Given
      const { result } = renderHook(() => useContacts(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const created = await result.current.operations.createContact({
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
      await result.current.operations.deleteContact(created.id)

      // Then
      await waitFor(() => {
        expect(result.current.contacts?.length).toBe(0)
      })
    })

    it('should search contacts by query', async () => {
      // Given
      const { result } = renderHook(() => useContacts(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await result.current.operations.createContact({
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
      const results = await result.current.operations.searchContacts('David')

      // Then
      expect(results.length).toBe(1)
      expect(results[0].name).toBe('David Lee')
    })
  })
})
