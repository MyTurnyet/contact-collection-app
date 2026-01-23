import type { StorageService } from './StorageService'

/**
 * In-memory implementation of StorageService for testing.
 * Does not persist data between test runs.
 */
export class InMemoryStorageAdapter implements StorageService {
  private storage: Map<string, string> = new Map()

  getItem(key: string): string | null {
    return this.storage.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.storage.set(key, value)
  }

  removeItem(key: string): void {
    this.storage.delete(key)
  }

  clear(): void {
    this.storage.clear()
  }

  keys(): string[] {
    return Array.from(this.storage.keys())
  }
}
