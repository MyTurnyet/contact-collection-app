import { describe, it, expect, beforeEach } from 'vitest'
import { ListCategories } from '../ListCategories'
import { InMemoryCategoryRepository } from '../test-doubles/InMemoryCategoryRepository'
import { CreateCategory } from '../CreateCategory'

describe('ListCategories', () => {
  let repository: InMemoryCategoryRepository
  let listCategories: ListCategories
  let createCategory: CreateCategory

  beforeEach(() => {
    repository = new InMemoryCategoryRepository()
    listCategories = new ListCategories(repository)
    createCategory = new CreateCategory(repository)
  })

  it('should return empty collection when no categories exist', async () => {
    const categories = await listCategories.execute()

    expect(categories.size).toBe(0)
    expect(categories.toArray()).toEqual([])
  })

  it('should return all categories', async () => {
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

    const categories = await listCategories.execute()

    expect(categories.size).toBe(3)
  })

  it('should return categories with all their data', async () => {
    await createCategory.execute({
      name: 'Family',
      frequencyValue: 1,
      frequencyUnit: 'weeks',
    })

    const categories = await listCategories.execute()
    const categoryArray = categories.toArray()

    expect(categoryArray[0].name).toBe('Family')
  })

  it('should return updated collection after adding categories', async () => {
    await createCategory.execute({
      name: 'Family',
      frequencyValue: 1,
      frequencyUnit: 'weeks',
    })

    let categories = await listCategories.execute()
    expect(categories.size).toBe(1)

    await createCategory.execute({
      name: 'Friends',
      frequencyValue: 2,
      frequencyUnit: 'weeks',
    })
    categories = await listCategories.execute()
    expect(categories.size).toBe(2)
  })

  it('should handle multiple categories with different frequencies', async () => {
    await createCategory.execute({
      name: 'Family',
      frequencyValue: 1,
      frequencyUnit: 'weeks',
    })
    await createCategory.execute({
      name: 'Friends',
      frequencyValue: 2,
      frequencyUnit: 'months',
    })
    await createCategory.execute({
      name: 'Acquaintances',
      frequencyValue: 3,
      frequencyUnit: 'months',
    })

    const categories = await listCategories.execute()
    const categoryArray = categories.toArray()

    expect(categories.size).toBe(3)
    expect(categoryArray.some((c) => c.name === 'Family')).toBe(true)
    expect(categoryArray.some((c) => c.name === 'Friends')).toBe(true)
    expect(categoryArray.some((c) => c.name === 'Acquaintances')).toBe(true)
  })
})
