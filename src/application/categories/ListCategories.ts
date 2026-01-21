import {
  type CategoryRepository,
  type CategoryCollection,
} from '../../domain/category'

export class ListCategories {
  private readonly repository: CategoryRepository

  constructor(repository: CategoryRepository) {
    this.repository = repository
  }

  async execute(): Promise<CategoryCollection> {
    return this.repository.findAll()
  }
}
