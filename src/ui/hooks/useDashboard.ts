import { useState, useEffect, useCallback } from 'react'
import { useDependencies } from '../../di'
import type { CheckIn } from '../../domain/checkin/CheckIn'
import type { DashboardSummary } from '../../application/dashboard/DashboardSummary'

export interface UseDashboardResult {
  summary: DashboardSummary | null
  todayCheckIns: readonly CheckIn[] | null
  isLoading: boolean
  error: Error | null
  operations: {
    getSummary: () => Promise<DashboardSummary>
    getTodayCheckIns: () => Promise<readonly CheckIn[]>
    refresh: () => Promise<void>
  }
}

/**
 * Hook for managing dashboard data with state
 * Auto-fetches summary and today's check-ins on mount
 */
export function useDashboard(): UseDashboardResult {
  const container = useDependencies()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [todayCheckIns, setTodayCheckIns] = useState<readonly CheckIn[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const summaryUseCase = container.getGetDashboardSummary()
      const todayUseCase = container.getGetTodayCheckIns()

      const [summaryData, todayCollection] = await Promise.all([
        summaryUseCase.execute(),
        todayUseCase.execute(),
      ])

      setSummary(summaryData)
      setTodayCheckIns(todayCollection.toArray())
    } catch (err) {
      const appError = err instanceof Error ? err : new Error('Unknown')
      setError(appError)
    } finally {
      setIsLoading(false)
    }
  }, [container])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const getSummary = useCallback(
    async (): Promise<DashboardSummary> => {
      const useCase = container.getGetDashboardSummary()
      return useCase.execute()
    },
    [container]
  )

  const getTodayCheckIns = useCallback(
    async (): Promise<readonly CheckIn[]> => {
      const useCase = container.getGetTodayCheckIns()
      const collection = await useCase.execute()
      return collection.toArray()
    },
    [container]
  )

  const refresh = useCallback(async (): Promise<void> => {
    await loadDashboard()
  }, [loadDashboard])

  return {
    summary,
    todayCheckIns,
    isLoading,
    error,
    operations: {
      getSummary,
      getTodayCheckIns,
      refresh,
    },
  }
}
