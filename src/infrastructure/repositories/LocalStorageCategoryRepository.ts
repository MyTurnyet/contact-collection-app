import type { CategoryRepository } from '../../domain/category/CategoryRepository'
import type { Category } from '../../domain/category/Category'
import type { CategoryId } from '../../domain/category/CategoryId'
import { categoryIdEquals } from '../../domain/category/CategoryId'
import type CategoryCollection from '../../domain/category/collections/CategoryCollection'
import { createCategoryCollection } from '../../domain/category/collections/CategoryCollection'
import type { StorageService } from '../storage/StorageService'
import type { CollectionSerializer } from '../storage/Serializer'

const STORAGE_KEY = 'categories'

export class LocalStorageCategoryRepository implements CategoryRepository {
  private readonly storage: StorageService
  private readonly serializer: CollectionSerializer<Category>

  constructor(
    storage: StorageService,
    serializer: CollectionSerializer<Category>
  ) {
    this.storage = storage
    this.serializer = serializer
  }

  async save(category: Category): Promise<void> {
    const categories = await this.loadCategories()
    const updated = this.upsertCategory(categories, category)
    this.persistCategories(updated)
  }

  async findById(id: CategoryId): Promise<Category | null> {
    const categories = await this.loadCategories()
    return categories.find((c) => categoryIdEquals(c.id, id)) ?? null
  }

  async findAll(): Promise<CategoryCollection> {
    const categories = await this.loadCategories()
    return createCategoryCollection(categories)
  }

  async delete(id: CategoryId): Promise<void> {
    const categories = await this.loadCategories()
    const filtered = categories.filter((c) => !categoryIdEquals(c.id, id))
    this.persistCategories(filtered)
  }

  private async loadCategories(): Promise<Category[]> {
    const data = this.storage.getItem(STORAGE_KEY)
    return data ? this.serializer.deserializeCollection(data) : []
  }

  private persistCategories(categories: Category[]): void {
    const serialized = this.serializer.serializeCollection(categories)
    this.storage.setItem(STORAGE_KEY, serialized)
  }

  private upsertCategory(
    categories: Category[],
    category: Category
  ): Category[] {
    const filtered = categories.filter((c) => !categoryIdEquals(c.id, category.id))
    return [...filtered, category]
  }
}
