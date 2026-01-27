import { useEffect, useRef, useState } from 'react'
import { useDependencies } from '../../di'

export interface UseBackgroundSchedulerResult {
  isRunning: boolean
  error: Error | null
}

export function useBackgroundScheduler(): UseBackgroundSchedulerResult {
  const container = useDependencies()
  const [error, setError] = useState<Error | null>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return

    initializedRef.current = true

    try {
      container.startScheduler()
    } catch (err) {
      queueMicrotask(() => setError(err as Error))
    }

    return () => {
      if (initializedRef.current) {
        try {
          container.stopScheduler()
        } catch (err) {
          queueMicrotask(() => setError(err as Error))
        }
      }
    }
  }, [container])

  return {
    isRunning: true,
    error,
  }
}
