import type { Migration } from './Migration'

/**
 * Registry of all data migrations.
 * Migrations are executed in order by version number.
 * Add new migrations to this array with incrementing version numbers.
 */
export const migrations: Migration[] = [
  // Example migration structure:
  // {
  //   version: 1,
  //   up: async () => {
  //     // Migration logic here
  //   },
  // },
]
