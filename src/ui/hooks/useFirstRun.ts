import { useState, useEffect, useCallback } from 'react'

const FIRST_RUN_KEY = 'app_initialized'

export interface UseFirstRunResult {
  isFirstRun: boolean
  isLoading: boolean
  completeSetup: () => void
}

export function useFirstRun(): UseFirstRunResult {
  const [isFirstRun, setIsFirstRun] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initialized = localStorage.getItem(FIRST_RUN_KEY)
    queueMicrotask(() => {
      setIsFirstRun(initialized !== 'true')
      setIsLoading(false)
    })
  }, [])

  const completeSetup = useCallback(() => {
    localStorage.setItem(FIRST_RUN_KEY, 'true')
    setIsFirstRun(false)
  }, [])

  return {
    isFirstRun,
    isLoading,
    completeSetup,
  }
}
