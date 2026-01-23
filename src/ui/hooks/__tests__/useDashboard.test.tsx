import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDashboard } from '../useDashboard'
import { DependencyProvider } from '../../../di'
import { DIContainer } from '../../../di/DIContainer'

describe('useDashboard', () => {
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
    it('should start with loading state', () => {
      // When
      const { result } = renderHook(() => useDashboard(), { wrapper })

      // Then
      expect(result.current.isLoading).toBe(true)
      expect(result.current.summary).toBeNull()
      expect(result.current.todayCheckIns).toBeNull()
      expect(result.current.error).toBeNull()
    })

    it('should load dashboard data on mount', async () => {
      // When
      const { result } = renderHook(() => useDashboard(), { wrapper })

      // Then
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.summary).toBeDefined()
      expect(result.current.summary?.totalContacts).toBe(0)
      expect(result.current.summary?.overdueCount).toBe(0)
      expect(result.current.summary?.upcomingCount).toBe(0)
      expect(result.current.todayCheckIns).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('should refresh dashboard data manually', async () => {
      // Given
      const { result } = renderHook(() => useDashboard(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // When
      await result.current.operations.refresh()

      // Then
      expect(result.current.summary).toBeDefined()
      expect(result.current.todayCheckIns).toEqual([])
      expect(result.current.error).toBeNull()
    })
  })

  describe('operations', () => {
    it('should get dashboard summary', async () => {
      // Given
      const { result } = renderHook(() => useDashboard(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // When
      const summary = await result.current.operations.getSummary()

      // Then
      expect(summary.totalContacts).toBe(0)
      expect(summary.overdueCount).toBe(0)
      expect(summary.upcomingCount).toBe(0)
      expect(summary.contactsByCategory).toBeInstanceOf(Map)
    })

    it('should get today check-ins', async () => {
      // Given
      const { result } = renderHook(() => useDashboard(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // When
      const todayCheckIns = await result.current.operations.getTodayCheckIns()

      // Then
      expect(todayCheckIns).toEqual([])
    })

    it('should update summary after adding contacts', async () => {
      // Given
      const { result } = renderHook(() => useDashboard(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const createContact = container.getCreateContact()
      await createContact.execute({
        name: 'Test Contact',
        location: 'Test City',
        country: 'Test Country',
        timezone: 'UTC',
      })

      // When
      await result.current.operations.refresh()

      // Then
      await waitFor(() => {
        expect(result.current.summary?.totalContacts).toBe(1)
      })
    })
  })
})
