export class StorageQuotaExceededError extends Error {
  constructor(message: string = 'Storage quota exceeded') {
    super(message)
    this.name = 'StorageQuotaExceededError'
    Object.setPrototypeOf(this, StorageQuotaExceededError.prototype)
  }
}
