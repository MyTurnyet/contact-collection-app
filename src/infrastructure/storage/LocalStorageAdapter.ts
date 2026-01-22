import type { StorageService } from './StorageService'
import { StorageQuotaExceededError } from './StorageQuotaExceededError'

export class LocalStorageAdapter implements StorageService {
  private readonly storage: Storage

  constructor(storage: Storage = window.localStorage) {
    this.storage = storage
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key)
  }

  setItem(key: string, value: string): void {
    try {
      this.storage.setItem(key, value)
    } catch (error) {
      this.handleStorageError(error)
    }
  }

  removeItem(key: string): void {
    this.storage.removeItem(key)
  }

  clear(): void {
    this.storage.clear()
  }

  keys(): string[] {
    const keyList: string[] = []
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      if (key !== null) keyList.push(key)
    }
    return keyList
  }

  private handleStorageError(error: unknown): never {
    if (this.isQuotaExceededError(error)) {
      throw new StorageQuotaExceededError('Storage quota exceeded')
    }
    throw error
  }

  private isQuotaExceededError(error: unknown): boolean {
    return error instanceof Error && error.name === 'QuotaExceededError'
  }
}
