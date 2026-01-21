import { type CategoryId, type CategoryRepository } from '../../domain/category'

export class DeleteCategory {
  private readonly repository: CategoryRepository

  constructor(repository: CategoryRepository) {
    this.repository = repository
  }

  async execute(id: CategoryId): Promise<void> {
    await this.repository.delete(id)
  }
}
