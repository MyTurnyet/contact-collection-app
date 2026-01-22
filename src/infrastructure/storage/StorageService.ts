/**
 * Storage abstraction for key-value persistence.
 * Implementations can use LocalStorage, SessionStorage, IndexedDB, etc.
 */
export interface StorageService {
  /**
   * Retrieves a value by key.
   * @returns The stored value or null if not found
   */
  getItem(key: string): string | null

  /**
   * Stores a value with the given key.
   * @throws StorageQuotaExceededError if storage quota is exceeded
   */
  setItem(key: string, value: string): void

  /**
   * Removes a value by key.
   */
  removeItem(key: string): void

  /**
   * Clears all stored values.
   */
  clear(): void

  /**
   * Returns all keys currently in storage.
   */
  keys(): string[]
}
