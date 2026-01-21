import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteCategory } from '../DeleteCategory'
import { InMemoryCategoryRepository } from '../test-doubles/InMemoryCategoryRepository'
import { CreateCategory } from '../CreateCategory'
import { createCategoryId } from '../../../domain/category'

describe('DeleteCategory', () => {
  let repository: InMemoryCategoryRepository
  let deleteCategory: DeleteCategory
  let createCategory: CreateCategory

  beforeEach(() => {
    repository = new InMemoryCategoryRepository()
    deleteCategory = new DeleteCategory(repository)
    createCategory = new CreateCategory(repository)
  })

  it('should delete a category by id', async () => {
    const category = await createCategory.execute({
      name: 'Family',
      frequencyValue: 1,
      frequencyUnit: 'weeks',
    })

    await deleteCategory.execute(category.id)
    const found = await repository.findById(category.id)

    expect(found).toBeNull()
  })

  it('should not throw error when deleting non-existent category', async () => {
    await expect(
      deleteCategory.execute(createCategoryId())
    ).resolves.not.toThrow()
  })

  it('should delete the correct category when multiple exist', async () => {
    const category1 = await createCategory.execute({
      name: 'Family',
      frequencyValue: 1,
      frequencyUnit: 'weeks',
    })
    const category2 = await createCategory.execute({
      name: 'Friends',
      frequencyValue: 2,
      frequencyUnit: 'weeks',
    })
    const category3 = await createCategory.execute({
      name: 'Colleagues',
      frequencyValue: 1,
      frequencyUnit: 'months',
    })

    await deleteCategory.execute(category2.id)

    const found1 = await repository.findById(category1.id)
    const found2 = await repository.findById(category2.id)
    const found3 = await repository.findById(category3.id)

    expect(found1).toBeDefined()
    expect(found2).toBeNull()
    expect(found3).toBeDefined()
  })

  it('should reduce total categories count after deletion', async () => {
    await createCategory.execute({
      name: 'Family',
      frequencyValue: 1,
      frequencyUnit: 'weeks',
    })
    await createCategory.execute({
      name: 'Friends',
      frequencyValue: 2,
      frequencyUnit: 'weeks',
    })
    await createCategory.execute({
      name: 'Colleagues',
      frequencyValue: 1,
      frequencyUnit: 'months',
    })

    let categories = await repository.findAll()
    expect(categories.size).toBe(3)

    const category = await createCategory.execute({
      name: 'Test',
      frequencyValue: 1,
      frequencyUnit: 'weeks',
    })
    await deleteCategory.execute(category.id)

    categories = await repository.findAll()
    expect(categories.size).toBe(3)
  })

  it('should allow re-deletion of already deleted category', async () => {
    const category = await createCategory.execute({
      name: 'Family',
      frequencyValue: 1,
      frequencyUnit: 'weeks',
    })

    await deleteCategory.execute(category.id)
    await expect(deleteCategory.execute(category.id)).resolves.not.toThrow()

    const found = await repository.findById(category.id)
    expect(found).toBeNull()
  })
})
