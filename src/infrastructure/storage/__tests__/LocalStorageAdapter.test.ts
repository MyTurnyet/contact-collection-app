import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocalStorageAdapter } from '../LocalStorageAdapter'
import { StorageQuotaExceededError } from '../StorageQuotaExceededError'

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter
  let mockStorage: Storage

  beforeEach(() => {
    // Create a fresh mock storage for each test
    const store: Record<string, string> = {}
    mockStorage = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key]
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach((key) => delete store[key])
      }),
      get length() {
        return Object.keys(store).length
      },
      key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
    }
    adapter = new LocalStorageAdapter(mockStorage)
  })

  describe('getItem', () => {
    it('returns stored value when key exists', () => {
      mockStorage.setItem('test-key', 'test-value')

      const result = adapter.getItem('test-key')

      expect(result).toBe('test-value')
    })

    it('returns null when key does not exist', () => {
      const result = adapter.getItem('non-existent-key')

      expect(result).toBeNull()
    })
  })

  describe('setItem', () => {
    it('stores value with given key', () => {
      adapter.setItem('my-key', 'my-value')

      expect(mockStorage.getItem('my-key')).toBe('my-value')
    })

    it('overwrites existing value', () => {
      adapter.setItem('key', 'old-value')
      adapter.setItem('key', 'new-value')

      expect(mockStorage.getItem('key')).toBe('new-value')
    })

    it('throws StorageQuotaExceededError when quota exceeded', () => {
      mockStorage.setItem = vi.fn(() => {
        const error = new Error('QuotaExceededError')
        error.name = 'QuotaExceededError'
        throw error
      })

      expect(() => adapter.setItem('key', 'value')).toThrow(
        StorageQuotaExceededError
      )
    })
  })

  describe('removeItem', () => {
    it('removes value by key', () => {
      mockStorage.setItem('key', 'value')

      adapter.removeItem('key')

      expect(mockStorage.getItem('key')).toBeNull()
    })

    it('does nothing when key does not exist', () => {
      expect(() => adapter.removeItem('non-existent')).not.toThrow()
    })
  })

  describe('clear', () => {
    it('removes all stored values', () => {
      mockStorage.setItem('key1', 'value1')
      mockStorage.setItem('key2', 'value2')
      mockStorage.setItem('key3', 'value3')

      adapter.clear()

      expect(mockStorage.getItem('key1')).toBeNull()
      expect(mockStorage.getItem('key2')).toBeNull()
      expect(mockStorage.getItem('key3')).toBeNull()
    })
  })

  describe('keys', () => {
    it('returns empty array when no keys stored', () => {
      const result = adapter.keys()

      expect(result).toEqual([])
    })

    it('returns all stored keys', () => {
      mockStorage.setItem('key1', 'value1')
      mockStorage.setItem('key2', 'value2')
      mockStorage.setItem('key3', 'value3')

      const result = adapter.keys()

      expect(result).toHaveLength(3)
      expect(result).toContain('key1')
      expect(result).toContain('key2')
      expect(result).toContain('key3')
    })
  })
})
