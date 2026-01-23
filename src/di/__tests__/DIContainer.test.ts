import { describe, it, expect, beforeEach } from 'vitest'
import { DIContainer } from '../DIContainer'

describe('DIContainer', () => {
  let container: DIContainer

  beforeEach(() => {
    container = new DIContainer()
  })

  describe('Contact Use Cases', () => {
    it('should provide CreateContact use case', () => {
      const useCase = container.getCreateContact()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })

    it('should provide UpdateContact use case', () => {
      const useCase = container.getUpdateContact()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })

    it('should provide GetContactById use case', () => {
      const useCase = container.getGetContactById()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })

    it('should provide ListAllContacts use case', () => {
      const useCase = container.getListAllContacts()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })

    it('should provide DeleteContact use case', () => {
      const useCase = container.getDeleteContact()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })

    it('should provide SearchContacts use case', () => {
      const useCase = container.getSearchContacts()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })
  })

  describe('Category Use Cases', () => {
    it('should provide CreateCategory use case', () => {
      const useCase = container.getCreateCategory()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })

    it('should provide UpdateCategory use case', () => {
      const useCase = container.getUpdateCategory()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })

    it('should provide DeleteCategory use case', () => {
      const useCase = container.getDeleteCategory()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })

    it('should provide ListCategories use case', () => {
      const useCase = container.getListCategories()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })

    it('should provide GetDefaultCategories use case', () => {
      const useCase = container.getGetDefaultCategories()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })

    it('should provide AssignContactToCategory use case', () => {
      const useCase = container.getAssignContactToCategory()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })
  })

  describe('CheckIn Use Cases', () => {
    it('should provide ScheduleInitialCheckIn use case', () => {
      const useCase = container.getScheduleInitialCheckIn()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })

    it('should provide GetUpcomingCheckIns use case', () => {
      const useCase = container.getGetUpcomingCheckIns()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })

    it('should provide GetOverdueCheckIns use case', () => {
      const useCase = container.getGetOverdueCheckIns()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })

    it('should provide CompleteCheckIn use case', () => {
      const useCase = container.getCompleteCheckIn()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })

    it('should provide RescheduleCheckIn use case', () => {
      const useCase = container.getRescheduleCheckIn()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })

    it('should provide GetCheckInHistory use case', () => {
      const useCase = container.getGetCheckInHistory()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })
  })

  describe('Dashboard Use Cases', () => {
    it('should provide GetDashboardSummary use case', () => {
      const useCase = container.getGetDashboardSummary()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })

    it('should provide GetTodayCheckIns use case', () => {
      const useCase = container.getGetTodayCheckIns()
      expect(useCase).toBeDefined()
      expect(useCase.execute).toBeDefined()
    })
  })

  describe('Services', () => {
    it('should provide NotificationService', () => {
      const service = container.getNotificationService()
      expect(service).toBeDefined()
      expect(service.showNotification).toBeDefined()
    })

    it('should provide EmailSimulator', () => {
      const service = container.getEmailSimulator()
      expect(service).toBeDefined()
      expect(service.sendEmail).toBeDefined()
    })

    it('should provide Scheduler', () => {
      const service = container.getScheduler()
      expect(service).toBeDefined()
      expect(service.start).toBeDefined()
      expect(service.stop).toBeDefined()
    })
  })

  describe('Scheduler Management', () => {
    it('should start scheduler with overdue detector', () => {
      // When
      container.startScheduler()
      const scheduler = container.getScheduler()

      // Then
      expect(scheduler.isRunning()).toBe(true)
    })

    it('should stop scheduler', () => {
      // Given
      container.startScheduler()

      // When
      container.stopScheduler()
      const scheduler = container.getScheduler()

      // Then
      expect(scheduler.isRunning()).toBe(false)
    })
  })
})
