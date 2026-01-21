import {
  type Category,
  type CategoryId,
  type CategoryRepository,
  type FrequencyUnit,
  createCategory,
  createCategoryName,
  createCheckInFrequency,
} from '../../domain/category'

export interface UpdateCategoryInput {
  id: CategoryId
  name?: string
  frequencyValue?: number
  frequencyUnit?: FrequencyUnit
}

export class UpdateCategory {
  private readonly repository: CategoryRepository

  constructor(repository: CategoryRepository) {
    this.repository = repository
  }

  async execute(input: UpdateCategoryInput): Promise<Category> {
    const existingCategory = await this.getExistingCategory(input.id)
    const updatedCategory = this.buildUpdatedCategory(existingCategory, input)
    await this.repository.save(updatedCategory)
    return updatedCategory
  }

  private async getExistingCategory(id: CategoryId): Promise<Category> {
    const category = await this.repository.findById(id)
    if (!category) {
      throw new Error('Category not found')
    }
    return category
  }

  private buildUpdatedCategory(
    existing: Category,
    input: UpdateCategoryInput
  ): Category {
    return createCategory({
      id: existing.id,
      name: this.updateName(existing, input),
      frequency: this.updateFrequency(existing, input),
    })
  }

  private updateName(existing: Category, input: UpdateCategoryInput) {
    if (input.name !== undefined) {
      return createCategoryName(input.name)
    }
    return existing.name
  }

  private updateFrequency(existing: Category, input: UpdateCategoryInput) {
    const hasFrequencyData = input.frequencyValue !== undefined
    if (hasFrequencyData && input.frequencyUnit) {
      return createCheckInFrequency({
        value: input.frequencyValue!,
        unit: input.frequencyUnit,
      })
    }
    return existing.frequency
  }
}
