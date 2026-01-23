import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCheckIns } from '../useCheckIns'
import { DependencyProvider } from '../../../di'
import { DIContainer } from '../../../di/DIContainer'
import { addDays } from 'date-fns'

describe('useCheckIns', () => {
  let container: DIContainer

  beforeEach(async () => {
    container = new DIContainer()
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DependencyProvider container={container}>{children}</DependencyProvider>
  )

  describe('state management', () => {
    it('should start with loading state', () => {
      // When
      const { result } = renderHook(() => useCheckIns(), { wrapper })

      // Then
      expect(result.current.isLoading).toBe(true)
      expect(result.current.upcomingCheckIns).toBeNull()
      expect(result.current.overdueCheckIns).toBeNull()
      expect(result.current.error).toBeNull()
    })

    it('should load check-ins on mount', async () => {
      // When
      const { result } = renderHook(() => useCheckIns(), { wrapper })

      // Then
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.upcomingCheckIns).toEqual([])
      expect(result.current.overdueCheckIns).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('should refresh check-ins manually', async () => {
      // Given
      const { result } = renderHook(() => useCheckIns(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // When
      await result.current.operations.refresh()

      // Then
      expect(result.current.upcomingCheckIns).toEqual([])
      expect(result.current.overdueCheckIns).toEqual([])
      expect(result.current.error).toBeNull()
    })
  })

  describe('operations', () => {
    it('should get upcoming check-ins for specified days', async () => {
      // Given
      const { result } = renderHook(() => useCheckIns(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // When
      const upcoming = await result.current.operations.getUpcoming(14)

      // Then
      expect(upcoming).toEqual([])
    })

    it('should complete a check-in', async () => {
      // Given
      const { result } = renderHook(() => useCheckIns(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Create a contact and category first
      const createContact = container.getCreateContact()
      const contact = await createContact.execute({
        name: 'Test Contact',
        location: 'Test City',
        country: 'Test Country',
        timezone: 'UTC',
      })

      const createCategory = container.getCreateCategory()
      const category = await createCategory.execute({
        name: 'Test Category',
        frequencyValue: 1,
        frequencyUnit: 'weeks',
      })

      const assignContact = container.getAssignContactToCategory()
      await assignContact.execute({
        contactId: contact.id,
        categoryId: category.id,
      })

      const scheduleCheckIn = container.getScheduleInitialCheckIn()
      const scheduled = await scheduleCheckIn.execute({
        contactId: contact.id,
        baseDate: new Date(),
      })

      // When
      const completionResult = await result.current.operations.complete({
        checkInId: scheduled.id,
        completionDate: new Date(),
        notes: 'Had a great conversation',
      })

      // Then
      expect(completionResult.completedCheckIn).toBeDefined()
      expect(completionResult.nextCheckIn).toBeDefined()
    })

    it('should reschedule a check-in', async () => {
      // Given
      const { result } = renderHook(() => useCheckIns(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const createContact = container.getCreateContact()
      const contact = await createContact.execute({
        name: 'Test Contact',
        location: 'Test City',
        country: 'Test Country',
        timezone: 'UTC',
      })

      const createCategory = container.getCreateCategory()
      const category = await createCategory.execute({
        name: 'Test Category',
        frequencyValue: 1,
        frequencyUnit: 'weeks',
      })

      const assignContact = container.getAssignContactToCategory()
      await assignContact.execute({
        contactId: contact.id,
        categoryId: category.id,
      })

      const scheduleCheckIn = container.getScheduleInitialCheckIn()
      const scheduled = await scheduleCheckIn.execute({
        contactId: contact.id,
        baseDate: new Date(),
      })

      const newDate = addDays(new Date(), 7)

      // When
      const rescheduled = await result.current.operations.reschedule({
        checkInId: scheduled.id,
        newScheduledDate: newDate,
      })

      // Then
      expect(rescheduled.scheduledDate).toEqual(newDate)
    })

    it('should get check-in history for contact', async () => {
      // Given
      const { result } = renderHook(() => useCheckIns(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const createContact = container.getCreateContact()
      const contact = await createContact.execute({
        name: 'Test Contact',
        location: 'Test City',
        country: 'Test Country',
        timezone: 'UTC',
      })

      // When
      const history = await result.current.operations.getHistory(contact.id)

      // Then
      expect(history).toEqual([])
    })
  })
})
