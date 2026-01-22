// Interfaces
export type { StorageService } from './StorageService'
export type { Serializer, CollectionSerializer } from './Serializer'

// Implementations
export { LocalStorageAdapter } from './LocalStorageAdapter'
export { JsonSerializer } from './JsonSerializer'

// Errors
export { StorageQuotaExceededError } from './StorageQuotaExceededError'
