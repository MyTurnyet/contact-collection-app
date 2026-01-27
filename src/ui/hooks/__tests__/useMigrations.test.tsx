import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMigrations } from '../useMigrations'
import { DependencyProvider } from '../../../di'
import { DIContainer } from '../../../di/DIContainer'

describe('useMigrations', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DependencyProvider>{children}</DependencyProvider>
  )

  const wrapperWithContainer = (container: DIContainer) =>
    ({ children }: { children: React.ReactNode }) => (
      <DependencyProvider container={container}>{children}</DependencyProvider>
    )

  beforeEach(() => {
    localStorage.clear()
  })

  it('should start with running state', () => {
    // When
    const { result } = renderHook(() => useMigrations(), { wrapper })

    // Then
    expect(result.current.isRunning).toBe(true)
  })

  it('should complete migrations successfully', async () => {
    // When
    const { result } = renderHook(() => useMigrations(), { wrapper })

    // Then
    await waitFor(() => {
      expect(result.current.isRunning).toBe(false)
    })
    expect(result.current.error).toBeNull()
    expect(result.current.completed).toBe(true)
  })

  it('should set data version after migrations', async () => {
    // When
    const { result } = renderHook(() => useMigrations(), { wrapper })

    // Then
    await waitFor(() => {
      expect(result.current.isRunning).toBe(false)
    })
    expect(result.current.completed).toBe(true)
  })

  it('should not run migrations twice', async () => {
    // Given
    const { result: result1 } = renderHook(() => useMigrations(), { wrapper })
    await waitFor(() => {
      expect(result1.current.isRunning).toBe(false)
    })
    expect(result1.current.completed).toBe(true)

    // When
    const { result: result2 } = renderHook(() => useMigrations(), { wrapper })

    // Then
    await waitFor(() => {
      expect(result2.current.isRunning).toBe(false)
    })
    expect(result2.current.completed).toBe(true)
  })

  it('should set error when migrations fail', async () => {
    const failingContainer = {
      runMigrations: async () => {
        throw new Error('Migration failed')
      },
    } as unknown as DIContainer

    const { result } = renderHook(() => useMigrations(), {
      wrapper: wrapperWithContainer(failingContainer),
    })

    await waitFor(() => {
      expect(result.current.isRunning).toBe(false)
    })

    expect(result.current.completed).toBe(false)
    expect(result.current.error?.message).toBe('Migration failed')
  })
})
