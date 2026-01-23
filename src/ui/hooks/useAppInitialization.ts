import { useState, useEffect, useCallback } from 'react'
import { useDependencies } from '../../di'

const APP_INITIALIZED_KEY = 'app_initialized'

export interface UseAppInitializationResult {
  isInitializing: boolean
  isInitialized: boolean
  error: Error | null
  retry: () => void
}

/**
 * Hook to initialize the application on first load
 * - Seeds default categories
 * - Starts background scheduler
 * - Marks app as initialized in localStorage
 */
export function useAppInitialization(): UseAppInitializationResult {
  const container = useDependencies()
  const [isInitializing, setIsInitializing] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [retryTrigger, setRetryTrigger] = useState(0)

  const checkAlreadyInitialized = useCallback((): boolean => {
    return localStorage.getItem(APP_INITIALIZED_KEY) === 'true'
  }, [])

  const seedDefaultCategories = useCallback(async (): Promise<void> => {
    const getDefaults = container.getGetDefaultCategories()
    const createCategory = container.getCreateCategory()

    const defaults = getDefaults.execute()
    for (const category of defaults) {
      await createCategory.execute({
        name: category.name,
        frequencyValue: category.frequency.value,
        frequencyUnit: category.frequency.unit,
      })
    }
  }, [container])

  const startScheduler = useCallback((): void => {
    container.startScheduler()
  }, [container])

  const markAppAsInitialized = useCallback((): void => {
    localStorage.setItem(APP_INITIALIZED_KEY, 'true')
  }, [])

  const markAsComplete = useCallback((): void => {
    setIsInitialized(true)
  }, [])

  const handleError = useCallback((err: unknown): void => {
    const appError = err instanceof Error ? err : new Error('Unknown error')
    setError(appError)
    setIsInitialized(false)
  }, [])

  useEffect(() => {
    let cancelled = false

    const initializeApp = async () => {
      try {
        if (checkAlreadyInitialized()) {
          if (!cancelled) markAsComplete()
          return
        }

        if (!cancelled) setIsInitializing(true)
        if (!cancelled) setError(null)

        await seedDefaultCategories()
        if (cancelled) return

        startScheduler()
        markAppAsInitialized()
        if (!cancelled) markAsComplete()
      } catch (err) {
        if (!cancelled) handleError(err)
      } finally {
        if (!cancelled) setIsInitializing(false)
      }
    }

    initializeApp()

    return () => {
      cancelled = true
    }
  }, [
    retryTrigger,
    checkAlreadyInitialized,
    seedDefaultCategories,
    startScheduler,
    markAppAsInitialized,
    markAsComplete,
    handleError,
  ])

  const retry = (): void => {
    setRetryTrigger((prev) => prev + 1)
  }

  return {
    isInitializing,
    isInitialized,
    error,
    retry,
  }
}
