export abstract class BaseInMemoryRepository<
  TEntity,
  TId extends string,
  TCollection
> {
  protected entities: Map<string, TEntity> = new Map()

  async save(entity: TEntity): Promise<void> {
    const id = this.extractId(entity)
    this.entities.set(id, entity)
  }

  async findById(id: TId): Promise<TEntity | null> {
    return this.entities.get(id) || null
  }

  async findAll(): Promise<TCollection> {
    const allEntities = Array.from(this.entities.values())
    return this.createCollection(allEntities)
  }

  async delete(id: TId): Promise<void> {
    this.entities.delete(id)
  }

  clear(): void {
    this.entities.clear()
  }

  protected abstract extractId(entity: TEntity): string
  protected abstract createCollection(entities: TEntity[]): TCollection
}
