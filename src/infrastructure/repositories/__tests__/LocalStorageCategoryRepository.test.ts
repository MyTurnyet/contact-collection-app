import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageCategoryRepository } from '../LocalStorageCategoryRepository'
import {
  createCategory,
  createCategoryId,
  createCategoryName,
  createCheckInFrequency,
} from '../../../domain/category'
import { InMemoryStorageAdapter } from '../../storage/InMemoryStorageAdapter'
import { JsonSerializer } from '../../storage/JsonSerializer'

describe('LocalStorageCategoryRepository', () => {
  let repository: LocalStorageCategoryRepository
  let storage: InMemoryStorageAdapter
  let serializer: JsonSerializer

  beforeEach(() => {
    storage = new InMemoryStorageAdapter()
    serializer = new JsonSerializer()
    repository = new LocalStorageCategoryRepository(storage, serializer)
  })

  describe('save', () => {
    it('should save a category to storage', async () => {
      // Given
      const category = createCategory({
        id: createCategoryId(),
        name: createCategoryName('Family'),
        frequency: createCheckInFrequency({ value: 30, unit: 'days' }),
      })

      // When
      await repository.save(category)

      // Then
      const stored = storage.getItem('categories')
      expect(stored).not.toBeNull()
    })

    it('should update existing category when saving with same ID', async () => {
      // Given
      const category = createCategory({
        id: createCategoryId(),
        name: createCategoryName('Family'),
        frequency: createCheckInFrequency({ value: 30, unit: 'days' }),
      })
      await repository.save(category)

      const updated = {
        ...category,
        name: createCategoryName('Close Family'),
      }

      // When
      await repository.save(updated)

      // Then
      const found = await repository.findById(category.id)
      expect(found?.name).toBe('Close Family')
    })
  })

  describe('findById', () => {
    it('should return category when found', async () => {
      // Given
      const category = createCategory({
        id: createCategoryId(),
        name: createCategoryName('Family'),
        frequency: createCheckInFrequency({ value: 30, unit: 'days' }),
      })
      await repository.save(category)

      // When
      const found = await repository.findById(category.id)

      // Then
      expect(found).not.toBeNull()
      expect(found?.id).toBe(category.id)
    })

    it('should return null when category not found', async () => {
      // Given
      const nonExistentId = createCategoryId()

      // When
      const found = await repository.findById(nonExistentId)

      // Then
      expect(found).toBeNull()
    })
  })

  describe('findAll', () => {
    it('should return empty collection when no categories exist', async () => {
      // When
      const collection = await repository.findAll()

      // Then
      expect(collection.size).toBe(0)
    })

    it('should return all categories', async () => {
      // Given
      const category1 = createCategory({
        id: createCategoryId(),
        name: createCategoryName('Family'),
        frequency: createCheckInFrequency({ value: 30, unit: 'days' }),
      })
      const category2 = createCategory({
        id: createCategoryId(),
        name: createCategoryName('Friends'),
        frequency: createCheckInFrequency({ value: 90, unit: 'days' }),
      })
      await repository.save(category1)
      await repository.save(category2)

      // When
      const collection = await repository.findAll()

      // Then
      expect(collection.size).toBe(2)
    })
  })

  describe('delete', () => {
    it('should remove category from storage', async () => {
      // Given
      const category = createCategory({
        id: createCategoryId(),
        name: createCategoryName('Family'),
        frequency: createCheckInFrequency({ value: 30, unit: 'days' }),
      })
      await repository.save(category)

      // When
      await repository.delete(category.id)

      // Then
      const found = await repository.findById(category.id)
      expect(found).toBeNull()
    })

    it('should not throw when deleting non-existent category', async () => {
      // Given
      const nonExistentId = createCategoryId()

      // When/Then
      await expect(repository.delete(nonExistentId)).resolves.not.toThrow()
    })
  })
})
