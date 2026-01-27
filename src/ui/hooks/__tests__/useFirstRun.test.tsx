import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useFirstRun } from '../useFirstRun'
import { DependencyProvider } from '../../../di'

describe('useFirstRun', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DependencyProvider>{children}</DependencyProvider>
  )

  beforeEach(() => {
    localStorage.clear()
  })

  it('should detect first run when no flag exists', async () => {
    // When
    const { result } = renderHook(() => useFirstRun(), { wrapper })

    // Then
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.isFirstRun).toBe(true)
  })

  it('should not be first run when flag exists', async () => {
    // Given
    localStorage.setItem('app_initialized', 'true')

    // When
    const { result } = renderHook(() => useFirstRun(), { wrapper })

    // Then
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.isFirstRun).toBe(false)
  })

  it('should provide complete setup function', async () => {
    // Given
    const { result } = renderHook(() => useFirstRun(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // When
    result.current.completeSetup()

    // Then
    expect(localStorage.getItem('app_initialized')).toBe('true')
  })

  it('should update isFirstRun after completing setup', async () => {
    // Given
    const { result } = renderHook(() => useFirstRun(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isFirstRun).toBe(true)

    // When
    result.current.completeSetup()

    // Then
    await waitFor(() => {
      expect(result.current.isFirstRun).toBe(false)
    })
  })
})
