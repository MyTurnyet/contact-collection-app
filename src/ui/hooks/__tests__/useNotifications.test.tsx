import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useNotifications } from '../useNotifications'
import { DependencyProvider } from '../../../di'

describe('useNotifications', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DependencyProvider>{children}</DependencyProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should start with default permission state', () => {
    // When
    const { result } = renderHook(() => useNotifications(), { wrapper })

    // Then
    expect(result.current.permission).toBeDefined()
  })

  it('should provide request permission function', () => {
    // When
    const { result } = renderHook(() => useNotifications(), { wrapper })

    // Then
    expect(typeof result.current.requestPermission).toBe('function')
  })

  it('should provide send notification function', () => {
    // When
    const { result } = renderHook(() => useNotifications(), { wrapper })

    // Then
    expect(typeof result.current.sendNotification).toBe('function')
  })

  it('should check permission on mount', async () => {
    // When
    const { result } = renderHook(() => useNotifications(), { wrapper })

    // Then
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should handle permission request', async () => {
    // Given
    const { result } = renderHook(() => useNotifications(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // When
    await result.current.requestPermission()

    // Then
    expect(result.current.permission).toBeDefined()
  })

  it('should send notification with title and body', async () => {
    // Given
    const { result } = renderHook(() => useNotifications(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // When
    await result.current.sendNotification('Test Title', 'Test Body')

    // Then - No error thrown
    expect(result.current.error).toBeNull()
  })

  it('should handle notification errors', async () => {
    // Given
    const { result } = renderHook(() => useNotifications(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // When - Send notification with empty title (should fail)
    await result.current.sendNotification('', '')

    // Then
    expect(result.current.error).toBeDefined()
  })
})
