import { describe, it, expect, beforeEach } from 'vitest'
import { CreateCategory } from '../CreateCategory'
import { InMemoryCategoryRepository } from '../test-doubles/InMemoryCategoryRepository'

describe('CreateCategory', () => {
  let repository: InMemoryCategoryRepository
  let createCategory: CreateCategory

  beforeEach(() => {
    repository = new InMemoryCategoryRepository()
    createCategory = new CreateCategory(repository)
  })

  it('should create a category with name and frequency', async () => {
    const categoryData = {
      name: 'Family',
      frequencyValue: 1,
      frequencyUnit: 'weeks' as const,
    }

    const category = await createCategory.execute(categoryData)

    expect(category.name).toBe('Family')
    expect(category.id).toBeDefined()
  })

  it('should create a category with different frequency units', async () => {
    const categoryData = {
      name: 'Friends',
      frequencyValue: 2,
      frequencyUnit: 'months' as const,
    }

    const category = await createCategory.execute(categoryData)

    expect(category.name).toBe('Friends')
  })

  it('should save the category to the repository', async () => {
    const categoryData = {
      name: 'Colleagues',
      frequencyValue: 1,
      frequencyUnit: 'months' as const,
    }

    const category = await createCategory.execute(categoryData)
    const savedCategory = await repository.findById(category.id)

    expect(savedCategory).toBeDefined()
    expect(savedCategory?.name).toBe('Colleagues')
  })

  it('should throw error for empty name', async () => {
    const categoryData = {
      name: '',
      frequencyValue: 1,
      frequencyUnit: 'weeks' as const,
    }

    await expect(createCategory.execute(categoryData)).rejects.toThrow()
  })

  it('should throw error for invalid frequency value', async () => {
    const categoryData = {
      name: 'Test',
      frequencyValue: 0,
      frequencyUnit: 'weeks' as const,
    }

    await expect(createCategory.execute(categoryData)).rejects.toThrow()
  })
})
