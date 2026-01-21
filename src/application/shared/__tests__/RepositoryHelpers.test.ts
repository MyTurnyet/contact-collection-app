import { describe, it, expect } from 'vitest'
import { getEntityOrThrow } from '../RepositoryHelpers'
import { EntityNotFoundError } from '../errors/EntityNotFoundError'

describe('getEntityOrThrow', () => {
  it('should return entity when found', async () => {
    const mockRepository = {
      findById: async (id: string) => ({ id, name: 'Test Entity' }),
    }

    const result = await getEntityOrThrow(mockRepository, '123', 'TestEntity')

    expect(result).toEqual({ id: '123', name: 'Test Entity' })
  })

  it('should throw EntityNotFoundError when entity not found', async () => {
    const mockRepository = {
      findById: async () => null,
    }

    await expect(
      getEntityOrThrow(mockRepository, '456', 'TestEntity')
    ).rejects.toThrow(EntityNotFoundError)
  })

  it('should include entity name in error', async () => {
    const mockRepository = {
      findById: async () => null,
    }

    try {
      await getEntityOrThrow(mockRepository, '789', 'Contact')
      throw new Error('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(EntityNotFoundError)
      expect((error as EntityNotFoundError).entityName).toBe('Contact')
    }
  })

  it('should include entity id in error', async () => {
    const mockRepository = {
      findById: async () => null,
    }

    try {
      await getEntityOrThrow(mockRepository, 'abc-123', 'Category')
      throw new Error('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(EntityNotFoundError)
      expect((error as EntityNotFoundError).entityId).toBe('abc-123')
    }
  })

  it('should work with different entity types', async () => {
    interface CustomEntity {
      customId: string
      data: number
    }

    const mockRepository = {
      findById: async (id: string): Promise<CustomEntity | null> => ({
        customId: id,
        data: 42,
      }),
    }

    const result = await getEntityOrThrow(mockRepository, 'custom-1', 'Custom')

    expect(result.customId).toBe('custom-1')
    expect(result.data).toBe(42)
  })
})
