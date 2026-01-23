import { useState, useEffect, useCallback } from 'react'
import { useDependencies } from '../../di'
import type { Category } from '../../domain/category/Category'
import type { CategoryId } from '../../domain/category/CategoryId'
import type { FrequencyUnit } from '../../domain/category/CheckInFrequency'

export interface CategoryInput {
  name: string
  frequencyValue: number
  frequencyUnit: FrequencyUnit
}

export interface CategoryUpdateInput {
  name?: string
  frequencyValue?: number
  frequencyUnit?: FrequencyUnit
}

export interface UseCategoriesResult {
  categories: readonly Category[] | null
  isLoading: boolean
  error: Error | null
  operations: {
    createCategory: (input: CategoryInput) => Promise<Category>
    updateCategory: (id: CategoryId, input: CategoryUpdateInput) => Promise<Category>
    deleteCategory: (id: CategoryId) => Promise<void>
    refresh: () => Promise<void>
  }
}

/**
 * Hook for managing categories with state
 * Auto-fetches categories on mount and provides CRUD operations
 */
export function useCategories(): UseCategoriesResult {
  const container = useDependencies()
  const [categories, setCategories] = useState<readonly Category[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const useCase = container.getListCategories()
      const collection = await useCase.execute()
      setCategories(collection.toArray())
    } catch (err) {
      const appError = err instanceof Error ? err : new Error('Unknown')
      setError(appError)
    } finally {
      setIsLoading(false)
    }
  }, [container])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const createCategory = useCallback(
    async (input: CategoryInput): Promise<Category> => {
      const useCase = container.getCreateCategory()
      const category = await useCase.execute({
        name: input.name,
        frequencyValue: input.frequencyValue,
        frequencyUnit: input.frequencyUnit,
      })
      await loadCategories()
      return category
    },
    [container, loadCategories]
  )

  const updateCategory = useCallback(
    async (id: CategoryId, input: CategoryUpdateInput): Promise<Category> => {
      const useCase = container.getUpdateCategory()
      const updated = await useCase.execute({ id, ...input })
      await loadCategories()
      return updated
    },
    [container, loadCategories]
  )

  const deleteCategory = useCallback(
    async (id: CategoryId): Promise<void> => {
      const useCase = container.getDeleteCategory()
      await useCase.execute(id)
      await loadCategories()
    },
    [container, loadCategories]
  )

  const refresh = useCallback(async (): Promise<void> => {
    await loadCategories()
  }, [loadCategories])

  return {
    categories,
    isLoading,
    error,
    operations: {
      createCategory,
      updateCategory,
      deleteCategory,
      refresh,
    },
  }
}
