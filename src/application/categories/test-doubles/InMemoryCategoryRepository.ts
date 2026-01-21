import {
  type Category,
  type CategoryId,
  type CategoryRepository,
  type CategoryCollection,
  createCategoryCollection,
} from '../../../domain/category'
import { BaseInMemoryRepository } from '../../test-doubles/BaseInMemoryRepository'

export class InMemoryCategoryRepository
  extends BaseInMemoryRepository<Category, CategoryId, CategoryCollection>
  implements CategoryRepository
{
  protected extractId(entity: Category): string {
    return entity.id
  }

  protected createCollection(entities: Category[]): CategoryCollection {
    return createCategoryCollection(entities)
  }
}
