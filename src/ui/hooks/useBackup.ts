import { useState, useCallback } from 'react'
import { useDependencies } from '../../di'

export interface UseBackupResult {
  isCreating: boolean
  error: Error | null
  createBackup: () => Promise<void>
}

export function useBackup(): UseBackupResult {
  const container = useDependencies()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createBackup = useCallback(
    async (): Promise<void> => {
      setIsCreating(true)
      setError(null)

      try {
        await container.createBackup()
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsCreating(false)
      }
    },
    [container]
  )

  return {
    isCreating,
    error,
    createBackup,
  }
}
