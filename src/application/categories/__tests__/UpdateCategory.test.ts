import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateCategory } from '../UpdateCategory'
import { InMemoryCategoryRepository } from '../test-doubles/InMemoryCategoryRepository'
import { createCategory } from '../../../domain/category/Category'
import { createCategoryId } from '../../../domain/category/CategoryId'
import { createCategoryName } from '../../../domain/category/CategoryName'
import { createCheckInFrequency } from '../../../domain/category/CheckInFrequency'
import { EntityNotFoundError } from '../../shared/errors/EntityNotFoundError'

describe('UpdateCategory', () => {
  let repository: InMemoryCategoryRepository
  let updateCategory: UpdateCategory

  beforeEach(() => {
    repository = new InMemoryCategoryRepository()
    updateCategory = new UpdateCategory(repository)
  })

  it('should update category name', async () => {
    const categoryId = createCategoryId()
    const existingCategory = createCategory({
      id: categoryId,
      name: createCategoryName('Family'),
      frequency: createCheckInFrequency({ value: 1, unit: 'weeks' }),
    })
    await repository.save(existingCategory)

    const result = await updateCategory.execute({
      id: categoryId,
      name: 'Close Family',
    })

    expect(result.name).toBe('Close Family')
    expect(result.id).toBe(categoryId)
  })

  it('should update category frequency', async () => {
    const categoryId = createCategoryId()
    const existingCategory = createCategory({
      id: categoryId,
      name: createCategoryName('Friends'),
      frequency: createCheckInFrequency({ value: 1, unit: 'weeks' }),
    })
    await repository.save(existingCategory)

    const result = await updateCategory.execute({
      id: categoryId,
      frequencyValue: 2,
      frequencyUnit: 'months',
    })

    expect(result.name).toBe('Friends')
  })

  it('should update name and frequency together', async () => {
    const categoryId = createCategoryId()
    const existingCategory = createCategory({
      id: categoryId,
      name: createCategoryName('Colleagues'),
      frequency: createCheckInFrequency({ value: 1, unit: 'months' }),
    })
    await repository.save(existingCategory)

    const result = await updateCategory.execute({
      id: categoryId,
      name: 'Work Friends',
      frequencyValue: 3,
      frequencyUnit: 'weeks',
    })

    expect(result.name).toBe('Work Friends')
  })

  it('should preserve unchanged fields', async () => {
    const categoryId = createCategoryId()
    const existingCategory = createCategory({
      id: categoryId,
      name: createCategoryName('Acquaintances'),
      frequency: createCheckInFrequency({ value: 3, unit: 'months' }),
    })
    await repository.save(existingCategory)

    const result = await updateCategory.execute({
      id: categoryId,
      name: 'Old Acquaintances',
    })

    expect(result.name).toBe('Old Acquaintances')
  })

  it('should throw error if category not found', async () => {
    const nonExistentId = createCategoryId()

    await expect(
      updateCategory.execute({
        id: nonExistentId,
        name: 'Test',
      })
    ).rejects.toThrow(EntityNotFoundError)
  })

  it('should throw error for invalid name', async () => {
    const categoryId = createCategoryId()
    const existingCategory = createCategory({
      id: categoryId,
      name: createCategoryName('Family'),
      frequency: createCheckInFrequency({ value: 1, unit: 'weeks' }),
    })
    await repository.save(existingCategory)

    await expect(
      updateCategory.execute({
        id: categoryId,
        name: '',
      })
    ).rejects.toThrow()
  })

  it('should throw error for invalid frequency value', async () => {
    const categoryId = createCategoryId()
    const existingCategory = createCategory({
      id: categoryId,
      name: createCategoryName('Friends'),
      frequency: createCheckInFrequency({ value: 1, unit: 'weeks' }),
    })
    await repository.save(existingCategory)

    await expect(
      updateCategory.execute({
        id: categoryId,
        frequencyValue: 0,
        frequencyUnit: 'weeks',
      })
    ).rejects.toThrow()
  })

  it('should save updated category to repository', async () => {
    const categoryId = createCategoryId()
    const existingCategory = createCategory({
      id: categoryId,
      name: createCategoryName('Family'),
      frequency: createCheckInFrequency({ value: 1, unit: 'weeks' }),
    })
    await repository.save(existingCategory)

    await updateCategory.execute({
      id: categoryId,
      name: 'Close Family',
    })

    const savedCategory = await repository.findById(categoryId)
    expect(savedCategory?.name).toBe('Close Family')
  })
})
