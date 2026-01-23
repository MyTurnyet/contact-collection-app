import { useState, useEffect, useCallback } from 'react'
import { useDependencies } from '../../di'
import type { CheckIn } from '../../domain/checkin/CheckIn'
import type { CheckInId } from '../../domain/checkin/CheckInId'
import type { ContactId } from '../../domain/contact/ContactId'
import type { CompleteCheckInResult } from '../../application/checkins/CompleteCheckIn'

export interface CompleteCheckInInput {
  checkInId: CheckInId
  completionDate: Date
  notes?: string
}

export interface RescheduleCheckInInput {
  checkInId: CheckInId
  newScheduledDate: Date
}

export interface UseCheckInsResult {
  upcomingCheckIns: readonly CheckIn[] | null
  overdueCheckIns: readonly CheckIn[] | null
  isLoading: boolean
  error: Error | null
  operations: {
    getUpcoming: (days?: number) => Promise<readonly CheckIn[]>
    getOverdue: () => Promise<readonly CheckIn[]>
    complete: (input: CompleteCheckInInput) => Promise<CompleteCheckInResult>
    reschedule: (input: RescheduleCheckInInput) => Promise<CheckIn>
    getHistory: (contactId: ContactId) => Promise<readonly CheckIn[]>
    refresh: () => Promise<void>
  }
}

/**
 * Hook for managing check-ins with state
 * Auto-fetches upcoming and overdue check-ins on mount
 */
export function useCheckIns(): UseCheckInsResult {
  const container = useDependencies()
  const [upcomingCheckIns, setUpcomingCheckIns] = useState<readonly CheckIn[] | null>(null)
  const [overdueCheckIns, setOverdueCheckIns] = useState<readonly CheckIn[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadCheckIns = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const upcomingUseCase = container.getGetUpcomingCheckIns()
      const overdueUseCase = container.getGetOverdueCheckIns()

      const [upcomingCollection, overdueCollection] = await Promise.all([
        upcomingUseCase.execute({ days: 7 }),
        overdueUseCase.execute(),
      ])

      setUpcomingCheckIns(upcomingCollection.toArray())
      setOverdueCheckIns(overdueCollection.toArray())
    } catch (err) {
      const appError = err instanceof Error ? err : new Error('Unknown')
      setError(appError)
    } finally {
      setIsLoading(false)
    }
  }, [container])

  useEffect(() => {
    loadCheckIns()
  }, [loadCheckIns])

  const getUpcoming = useCallback(
    async (days?: number): Promise<readonly CheckIn[]> => {
      const useCase = container.getGetUpcomingCheckIns()
      const collection = await useCase.execute({ days })
      return collection.toArray()
    },
    [container]
  )

  const getOverdue = useCallback(
    async (): Promise<readonly CheckIn[]> => {
      const useCase = container.getGetOverdueCheckIns()
      const collection = await useCase.execute()
      return collection.toArray()
    },
    [container]
  )

  const complete = useCallback(
    async (input: CompleteCheckInInput): Promise<CompleteCheckInResult> => {
      const useCase = container.getCompleteCheckIn()
      const result = await useCase.execute(input)
      await loadCheckIns()
      return result
    },
    [container, loadCheckIns]
  )

  const reschedule = useCallback(
    async (input: RescheduleCheckInInput): Promise<CheckIn> => {
      const useCase = container.getRescheduleCheckIn()
      const rescheduled = await useCase.execute(input)
      await loadCheckIns()
      return rescheduled
    },
    [container, loadCheckIns]
  )

  const getHistory = useCallback(
    async (contactId: ContactId): Promise<readonly CheckIn[]> => {
      const useCase = container.getGetCheckInHistory()
      const collection = await useCase.execute({ contactId })
      return collection.toArray()
    },
    [container]
  )

  const refresh = useCallback(async (): Promise<void> => {
    await loadCheckIns()
  }, [loadCheckIns])

  return {
    upcomingCheckIns,
    overdueCheckIns,
    isLoading,
    error,
    operations: {
      getUpcoming,
      getOverdue,
      complete,
      reschedule,
      getHistory,
      refresh,
    },
  }
}
