import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBackgroundScheduler } from '../useBackgroundScheduler'
import { DependencyProvider } from '../../../di'
import { DIContainer } from '../../../di/DIContainer'

describe('useBackgroundScheduler', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DependencyProvider>{children}</DependencyProvider>
  )

  const wrapperWithContainer = (container: DIContainer) =>
    ({ children }: { children: React.ReactNode }) => (
      <DependencyProvider container={container}>{children}</DependencyProvider>
    )

  beforeEach(() => {
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

  it('should set error when scheduler fails to start', async () => {
    const failingContainer = {
      startScheduler: () => {
        throw new Error('Start failed')
      },
      stopScheduler: () => undefined,
    } as unknown as DIContainer

    const { result } = renderHook(() => useBackgroundScheduler(), {
      wrapper: wrapperWithContainer(failingContainer),
    })

    await waitFor(() => {
      expect(result.current.error?.message).toBe('Start failed')
    })
  })

  it('should set error when scheduler fails to stop on cleanup', async () => {
    const failingContainer = {
      startScheduler: () => undefined,
      stopScheduler: () => {
        throw new Error('Stop failed')
      },
    } as unknown as DIContainer

    const safeContainer = {
      startScheduler: () => undefined,
      stopScheduler: () => undefined,
    } as unknown as DIContainer

    let currentContainer: DIContainer = failingContainer
    const dynamicWrapper = ({ children }: { children: React.ReactNode }) => (
      <DependencyProvider container={currentContainer}>{children}</DependencyProvider>
    )

    const { result, rerender } = renderHook(() => useBackgroundScheduler(), {
      wrapper: dynamicWrapper,
    })

    currentContainer = safeContainer
    rerender()

    await waitFor(() => {
      expect(result.current.error?.message).toBe('Stop failed')
    })
  })
})
