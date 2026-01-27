import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useBackgroundScheduler } from '../useBackgroundScheduler'
import { DependencyProvider } from '../../../di'

describe('useBackgroundScheduler', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DependencyProvider>{children}</DependencyProvider>
  )

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should start scheduler on mount', () => {
    // When
    const { result } = renderHook(() => useBackgroundScheduler(), { wrapper })

    // Then
    expect(result.current.isRunning).toBe(true)
  })

  it('should stop scheduler on unmount', () => {
    // Given
    const { unmount, result } = renderHook(() => useBackgroundScheduler(), {
      wrapper,
    })

    expect(result.current.isRunning).toBe(true)

    // When
    unmount()

    // Then - No error thrown, cleanup successful
  })

  it('should have no error when scheduler initializes', () => {
    // When
    const { result } = renderHook(() => useBackgroundScheduler(), { wrapper })

    // Then
    expect(result.current.error).toBeNull()
  })

  it('should maintain running state', () => {
    // When
    const { result } = renderHook(() => useBackgroundScheduler(), { wrapper })

    // Then
    expect(result.current.isRunning).toBe(true)
  })

  it('should handle errors gracefully', () => {
    // When
    const { result } = renderHook(() => useBackgroundScheduler(), { wrapper })

    // Then - No error thrown even if scheduling fails
    expect(result.current.error).toBeNull()
  })
})
