import { EntityNotFoundError } from './errors/EntityNotFoundError'

export async function getEntityOrThrow<TEntity, TId extends string>(
  repository: { findById(id: TId): Promise<TEntity | null> },
  id: TId,
  entityName: string
): Promise<TEntity> {
  const entity = await repository.findById(id)
  if (!entity) {
    throw new EntityNotFoundError(entityName, id)
  }
  return entity
}
