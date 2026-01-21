import {
  type Category,
  type CategoryId,
  type CategoryRepository,
  type CategoryCollection,
  createCategoryCollection,
} from '../../../domain/category'

export class InMemoryCategoryRepository implements CategoryRepository {
  private categories: Map<string, Category> = new Map()

  async save(category: Category): Promise<void> {
    this.categories.set(category.id, category)
  }

  async findById(id: CategoryId): Promise<Category | null> {
    return this.categories.get(id) || null
  }

  async findAll(): Promise<CategoryCollection> {
    const allCategories = Array.from(this.categories.values())
    return createCategoryCollection(allCategories)
  }

  async delete(id: CategoryId): Promise<void> {
    this.categories.delete(id)
  }

  clear(): void {
    this.categories.clear()
  }
}
