import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAppInitialization } from '../useAppInitialization'
import { DependencyProvider } from '../../../di'
import { DIContainer } from '../../../di/DIContainer'

describe('useAppInitialization', () => {
  let container: DIContainer

  beforeEach(() => {
    container = new DIContainer()
    // Clear localStorage before each test
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DependencyProvider container={container}>{children}</DependencyProvider>
  )

  it('should start in uninitialized state', () => {
    // When
    const { result } = renderHook(() => useAppInitialization(), { wrapper })

    // Then
    expect(result.current.isInitializing).toBe(true)
    expect(result.current.isInitialized).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should skip initialization if already initialized', async () => {
    // Given - mark app as already initialized
    localStorage.setItem('app_initialized', 'true')

    // When
    const { result } = renderHook(() => useAppInitialization(), { wrapper })

    // Then - should complete immediately
    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true)
    })

    expect(result.current.isInitializing).toBe(false)
  })

  it('should handle initialization errors gracefully', async () => {
    // Given - create a container that will fail
    const failingContainer = {
      ...container,
      getGetDefaultCategories: () => {
        throw new Error('Test error')
      },
    } as unknown as DIContainer

    const failingWrapper = ({ children }: { children: React.ReactNode }) => (
      <DependencyProvider container={failingContainer}>
        {children}
      </DependencyProvider>
    )

    // When
    const { result } = renderHook(() => useAppInitialization(), {
      wrapper: failingWrapper,
    })

    // Then
    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
    })

    expect(result.current.isInitializing).toBe(false)
    expect(result.current.isInitialized).toBe(false)
  })

  it('should set Unknown error when initialization throws non-Error', async () => {
    const failingContainer = {
      ...container,
      getGetDefaultCategories: () => {
        throw 'bad'
      },
    } as unknown as DIContainer

    const failingWrapper = ({ children }: { children: React.ReactNode }) => (
      <DependencyProvider container={failingContainer}>{children}</DependencyProvider>
    )

    const { result } = renderHook(() => useAppInitialization(), {
      wrapper: failingWrapper,
    })

    await waitFor(() => {
      expect(result.current.isInitializing).toBe(false)
    })

    expect(result.current.isInitialized).toBe(false)
    expect(result.current.error?.message).toBe('Unknown error')
  })

  it('should stop initialization work when unmounted mid-flight', async () => {
    const deferred = createDeferred<void>()

    const slowContainer = {
      ...container,
      getGetDefaultCategories: () => ({
        execute: () => [
          {
            name: 'Family',
            frequency: { value: 1, unit: 'days' },
          },
        ],
      }),
      getCreateCategory: () => ({
        execute: async () => {
          await deferred.promise
        },
      }),
      startScheduler: vi.fn(),
    } as unknown as DIContainer

    const slowWrapper = ({ children }: { children: React.ReactNode }) => (
      <DependencyProvider container={slowContainer}>{children}</DependencyProvider>
    )

    const { unmount } = renderHook(() => useAppInitialization(), { wrapper: slowWrapper })

    unmount()
    deferred.resolve()
    await deferred.promise
  })

  it('should provide retry function', () => {
    // When
    const { result } = renderHook(() => useAppInitialization(), { wrapper })

    // Then
    expect(result.current.retry).toBeInstanceOf(Function)
  })
})

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}
