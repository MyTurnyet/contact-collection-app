// Interfaces
export type { StorageService } from './StorageService'
export type { Serializer, CollectionSerializer } from './Serializer'

// Implementations
export { LocalStorageAdapter } from './LocalStorageAdapter'
export { JsonSerializer } from './JsonSerializer'
export { InMemoryStorageAdapter } from './InMemoryStorageAdapter'

// Errors
export { StorageQuotaExceededError } from './StorageQuotaExceededError'
