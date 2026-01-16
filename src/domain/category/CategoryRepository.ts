import { type Category } from './Category'
import { type CategoryId } from './CategoryId'
import type CategoryCollection from './collections/CategoryCollection'

export interface CategoryRepository {
  save(category: Category): Promise<void>
  findById(id: CategoryId): Promise<Category | null>
  findAll(): Promise<CategoryCollection>
  delete(id: CategoryId): Promise<void>
}
