import { describe, it, expect, beforeEach } from 'vitest'
import { MigrationManager } from '../MigrationManager'
import type { Migration } from '../Migration'

describe('MigrationManager', () => {
  let storage: Storage

  beforeEach(() => {
    storage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    }
  })

  it('should return current version when no migrations', () => {
    // Given
    const manager = new MigrationManager(storage, [])

    // When
    const version = manager.getCurrentVersion()

    // Then
    expect(version).toBe(0)
  })

  it('should return highest migration version', () => {
    // Given
    const migrations: Migration[] = [
      { version: 1, up: () => Promise.resolve() },
      { version: 2, up: () => Promise.resolve() },
    ]
    const manager = new MigrationManager(storage, migrations)

    // When
    const version = manager.getCurrentVersion()

    // Then
    expect(version).toBe(2)
  })

  it('should run pending migrations', async () => {
    // Given
    const executedVersions: number[] = []
    const migrations: Migration[] = [
      { version: 1, up: async () => { executedVersions.push(1) } },
      { version: 2, up: async () => { executedVersions.push(2) } },
    ]
    const manager = new MigrationManager(storage, migrations)

    // When
    await manager.migrate()

    // Then
    expect(executedVersions).toEqual([1, 2])
  })

  it('should skip already executed migrations', async () => {
    // Given
    const executedVersions: number[] = []
    storage.getItem = (key: string) => (key === 'data_version' ? '1' : null)
    const migrations: Migration[] = [
      { version: 1, up: async () => { executedVersions.push(1) } },
      { version: 2, up: async () => { executedVersions.push(2) } },
    ]
    const manager = new MigrationManager(storage, migrations)

    // When
    await manager.migrate()

    // Then
    expect(executedVersions).toEqual([2])
  })

  it('should update version after migration', async () => {
    // Given
    let storedVersion = '0'
    storage.getItem = (key: string) => (key === 'data_version' ? storedVersion : null)
    storage.setItem = (key: string, value: string) => {
      if (key === 'data_version') storedVersion = value
    }
    const migrations: Migration[] = [
      { version: 1, up: async () => {} },
    ]
    const manager = new MigrationManager(storage, migrations)

    // When
    await manager.migrate()

    // Then
    expect(storedVersion).toBe('1')
  })

  it('should execute migrations in order', async () => {
    // Given
    const executedVersions: number[] = []
    const migrations: Migration[] = [
      { version: 3, up: async () => { executedVersions.push(3) } },
      { version: 1, up: async () => { executedVersions.push(1) } },
      { version: 2, up: async () => { executedVersions.push(2) } },
    ]
    const manager = new MigrationManager(storage, migrations)

    // When
    await manager.migrate()

    // Then
    expect(executedVersions).toEqual([1, 2, 3])
  })

  it('should handle migration errors', async () => {
    // Given
    const migrations: Migration[] = [
      { version: 1, up: async () => { throw new Error('Migration failed') } },
    ]
    const manager = new MigrationManager(storage, migrations)

    // When/Then
    await expect(manager.migrate()).rejects.toThrow('Migration failed')
  })

  it('should not update version if migration fails', async () => {
    // Given
    let storedVersion = '0'
    storage.getItem = (key: string) => (key === 'data_version' ? storedVersion : null)
    storage.setItem = (key: string, value: string) => {
      if (key === 'data_version') storedVersion = value
    }
    const migrations: Migration[] = [
      { version: 1, up: async () => { throw new Error('Migration failed') } },
    ]
    const manager = new MigrationManager(storage, migrations)

    // When
    try {
      await manager.migrate()
    } catch {
      // Expected
    }

    // Then
    expect(storedVersion).toBe('0')
  })
})
