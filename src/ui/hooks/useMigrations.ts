import { useState, useEffect, useRef, useCallback } from 'react'
import { useDependencies } from '../../di'

export interface UseMigrationsResult {
  isRunning: boolean
  completed: boolean
  error: Error | null
}

export function useMigrations(): UseMigrationsResult {
  const container = useDependencies()
  const [isRunning, setIsRunning] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const executedRef = useRef(false)

  const runMigrations = useCallback(async (): Promise<void> => {
    try {
      await container.runMigrations()
      queueMicrotask(() => {
        setCompleted(true)
        setIsRunning(false)
      })
    } catch (err) {
      queueMicrotask(() => {
        setError(err as Error)
        setIsRunning(false)
      })
    }
  }, [container])

  useEffect(() => {
    if (executedRef.current) return

    executedRef.current = true
    runMigrations()
  }, [runMigrations])

  return {
    isRunning,
    completed,
    error,
  }
}
