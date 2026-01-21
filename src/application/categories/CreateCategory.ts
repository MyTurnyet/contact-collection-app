import {
  type Category,
  type CategoryRepository,
  type FrequencyUnit,
  createCategory,
  createCategoryId,
  createCategoryName,
  createCheckInFrequency,
} from '../../domain/category'

export interface CreateCategoryInput {
  name: string
  frequencyValue: number
  frequencyUnit: FrequencyUnit
}

export class CreateCategory {
  private readonly repository: CategoryRepository

  constructor(repository: CategoryRepository) {
    this.repository = repository
  }

  async execute(input: CreateCategoryInput): Promise<Category> {
    const category = this.buildCategory(input)
    await this.repository.save(category)
    return category
  }

  private buildCategory(input: CreateCategoryInput): Category {
    return createCategory({
      id: createCategoryId(),
      name: createCategoryName(input.name),
      frequency: createCheckInFrequency({
        value: input.frequencyValue,
        unit: input.frequencyUnit,
      }),
    })
  }
}
