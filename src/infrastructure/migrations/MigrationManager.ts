import type { Migration } from './Migration'

const VERSION_KEY = 'data_version'

export class MigrationManager {
  readonly storage: Storage
  readonly migrations: Migration[]

  constructor(storage: Storage, migrations: Migration[]) {
    this.storage = storage
    this.migrations = migrations
  }

  getCurrentVersion(): number {
    if (this.migrations.length === 0) return 0
    return Math.max(...this.migrations.map((m) => m.version))
  }

  async migrate(): Promise<void> {
    const currentVersion = this.getStoredVersion()
    const pending = this.getPendingMigrations(currentVersion)
    await this.executeMigrations(pending)
  }

  private getStoredVersion(): number {
    const stored = this.storage.getItem(VERSION_KEY)
    return stored ? parseInt(stored, 10) : 0
  }

  private getPendingMigrations(currentVersion: number): Migration[] {
    return this.migrations
      .filter((m) => m.version > currentVersion)
      .sort((a, b) => a.version - b.version)
  }

  private async executeMigrations(migrations: Migration[]): Promise<void> {
    for (const migration of migrations) {
      await this.executeMigration(migration)
    }
  }

  private async executeMigration(migration: Migration): Promise<void> {
    await migration.up()
    this.updateVersion(migration.version)
  }

  private updateVersion(version: number): void {
    this.storage.setItem(VERSION_KEY, version.toString())
  }
}
