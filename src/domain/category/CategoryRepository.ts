import { type Category } from './Category'
import { type CategoryId } from './CategoryId'

export interface CategoryRepository {
  save(category: Category): Promise<void>
  findById(id: CategoryId): Promise<Category | null>
  findAll(): Promise<Category[]>
  delete(id: CategoryId): Promise<void>
}
