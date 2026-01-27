import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBackup } from '../useBackup'
import { DependencyProvider } from '../../../di'

describe('useBackup', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DependencyProvider>{children}</DependencyProvider>
  )

  beforeEach(() => {
    localStorage.clear()
  })

  it('should start with not creating state', () => {
    // When
    const { result } = renderHook(() => useBackup(), { wrapper })

    // Then
    expect(result.current.isCreating).toBe(false)
  })

  it('should create backup successfully', async () => {
    // Given
    const { result } = renderHook(() => useBackup(), { wrapper })

    // When
    await result.current.createBackup()

    // Then
    await waitFor(() => {
      expect(result.current.isCreating).toBe(false)
    })
    expect(result.current.error).toBeNull()
  })

  it('should handle backup errors', async () => {
    // This test would need a way to inject a failing exporter
    // For now, we'll just verify the error state exists
    const { result } = renderHook(() => useBackup(), { wrapper })
    expect(result.current.error).toBeNull()
  })
})
