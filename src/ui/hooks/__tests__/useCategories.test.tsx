import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCategories } from '../useCategories'
import { DependencyProvider } from '../../../di'
import { DIContainer } from '../../../di/DIContainer'

describe('useCategories', () => {
  let container: DIContainer

  beforeEach(async () => {
    container = new DIContainer()
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DependencyProvider container={container}>{children}</DependencyProvider>
  )

  describe('state management', () => {
    it('should start with loading state', async () => {
      // When
      const { result } = renderHook(() => useCategories(), { wrapper })

      // Then
      expect(result.current.isLoading).toBe(true)
      expect(result.current.categories).toBeNull()
      expect(result.current.error).toBeNull()

      // Wait for async effects to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should load categories on mount', async () => {
      // When
      const { result } = renderHook(() => useCategories(), { wrapper })

      // Then
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.categories).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('should update state after creating category', async () => {
      // Given
      const { result } = renderHook(() => useCategories(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // When
      await result.current.operations.createCategory({
        name: 'Family',
        frequencyValue: 1,
        frequencyUnit: 'months',
      })

      // Then
      await waitFor(() => {
        expect(result.current.categories?.length).toBe(1)
      })

      expect(result.current.categories?.[0].name).toBe('Family')
    })

    it('should refresh categories manually', async () => {
      // Given
      const { result } = renderHook(() => useCategories(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // When
      await result.current.operations.refresh()

      // Then
      expect(result.current.categories).toEqual([])
      expect(result.current.error).toBeNull()
    })
  })

  describe('operations', () => {
    it('should create a new category', async () => {
      // Given
      const { result } = renderHook(() => useCategories(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // When
      const category = await result.current.operations.createCategory({
        name: 'Close Friends',
        frequencyValue: 2,
        frequencyUnit: 'weeks',
      })

      // Then
      expect(category.name).toBe('Close Friends')
      expect(category.frequency.value).toBe(2)
      expect(category.frequency.unit).toBe('weeks')
    })

    it('should update existing category', async () => {
      // Given
      const { result } = renderHook(() => useCategories(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const created = await result.current.operations.createCategory({
        name: 'Work Contacts',
        frequencyValue: 3,
        frequencyUnit: 'months',
      })

      // When
      const updated = await result.current.operations.updateCategory(created.id, {
        name: 'Business Contacts',
      })

      // Then
      expect(updated.name).toBe('Business Contacts')
      expect(updated.id).toBe(created.id)
    })

    it('should delete category', async () => {
      // Given
      const { result } = renderHook(() => useCategories(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const created = await result.current.operations.createCategory({
        name: 'Acquaintances',
        frequencyValue: 6,
        frequencyUnit: 'months',
      })

      // When
      await result.current.operations.deleteCategory(created.id)

      // Then
      await waitFor(() => {
        expect(result.current.categories?.length).toBe(0)
      })
    })
  })
})
