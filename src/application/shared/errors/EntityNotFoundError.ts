export class EntityNotFoundError extends Error {
  constructor(
    public readonly entityName: string,
    public readonly entityId: string
  ) {
    super(`${entityName} not found: ${entityId}`)
    this.name = 'EntityNotFoundError'
  }
}
