import { describe, it, expect, beforeEach } from 'vitest'
import { OverdueCheckInDetector } from '../OverdueCheckInDetector'
import { GetOverdueCheckIns } from '../../../application/checkins/GetOverdueCheckIns'
import { createCheckIn } from '../../../domain/checkin/CheckIn'
import { createCheckInId } from '../../../domain/checkin/CheckInId'
import { createContactId } from '../../../domain/contact/ContactId'
import { createScheduledDate } from '../../../domain/checkin/ScheduledDate'
import { createCheckInCollection } from '../../../domain/checkin/collections/CheckInCollection'
import type { NotificationService, NotificationOptions } from '../../notifications/NotificationService'
import type { CheckInRepository } from '../../../domain/checkin'

// Test double for CheckInRepository
class FakeCheckInRepository implements CheckInRepository {
  public checkIns = createCheckInCollection([])

  async findByStatus() {
    return this.checkIns
  }

  async findById() {
    return null
  }

  async findAll() {
    return this.checkIns
  }

  async findByContactId() {
    return this.checkIns
  }

  async findByDateRange() {
    return this.checkIns
  }

  async save() {
    // no-op
  }

  async delete() {
    // no-op
  }
}

// Test double for NotificationService
class FakeNotificationService implements NotificationService {
  public notifications: NotificationOptions[] = []
  public permission: 'granted' | 'denied' | 'default' = 'granted'

  async requestPermission() {
    return this.permission
  }

  getPermission() {
    return this.permission
  }

  async showNotification(options: NotificationOptions): Promise<void> {
    this.notifications.push(options)
  }

  isSupported(): boolean {
    return true
  }

  reset(): void {
    this.notifications = []
  }
}

describe('OverdueCheckInDetector', () => {
  let detector: OverdueCheckInDetector
  let fakeRepository: FakeCheckInRepository
  let notificationService: FakeNotificationService

  beforeEach(() => {
    fakeRepository = new FakeCheckInRepository()
    const getOverdueCheckIns = new GetOverdueCheckIns(fakeRepository)
    notificationService = new FakeNotificationService()
    detector = new OverdueCheckInDetector(getOverdueCheckIns, notificationService)
  })

  describe('execute', () => {
    it('should not send notification when no overdue check-ins', async () => {
      // Given
      fakeRepository.checkIns = createCheckInCollection([])

      // When
      await detector.execute()

      // Then
      expect(notificationService.notifications.length).toBe(0)
    })

    it('should send notification when overdue check-ins exist', async () => {
      // Given
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 30)

      const overdueCheckIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(pastDate),
      })

      fakeRepository.checkIns = createCheckInCollection([overdueCheckIn])

      // When
      await detector.execute()

      // Then
      expect(notificationService.notifications.length).toBe(1)
    })

    it('should include count in notification title', async () => {
      // Given
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 30)

      const checkIn1 = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(pastDate),
      })
      const checkIn2 = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(pastDate),
      })

      fakeRepository.checkIns = createCheckInCollection([checkIn1, checkIn2])

      // When
      await detector.execute()

      // Then
      const notification = notificationService.notifications[0]
      expect(notification.title).toContain('2')
    })

    it('should use singular form for single overdue check-in', async () => {
      // Given
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 30)

      const overdueCheckIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(pastDate),
      })

      fakeRepository.checkIns = createCheckInCollection([overdueCheckIn])

      // When
      await detector.execute()

      // Then
      const notification = notificationService.notifications[0]
      expect(notification.title).toContain('1')
      expect(notification.body).toContain('1 check-in that is overdue')
    })

    it('should use plural form for multiple overdue check-ins', async () => {
      // Given
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 30)

      const checkIn1 = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(pastDate),
      })
      const checkIn2 = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(pastDate),
      })

      fakeRepository.checkIns = createCheckInCollection([checkIn1, checkIn2])

      // When
      await detector.execute()

      // Then
      const notification = notificationService.notifications[0]
      expect(notification.body).toContain('2 check-ins that are overdue')
    })

    it('should include tag for notification grouping', async () => {
      // Given
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 30)

      const overdueCheckIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(pastDate),
      })

      fakeRepository.checkIns = createCheckInCollection([overdueCheckIn])

      // When
      await detector.execute()

      // Then
      const notification = notificationService.notifications[0]
      expect(notification.tag).toBe('overdue-checkins')
    })

    it('should not throw when notification service fails', async () => {
      // Given
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 30)

      const overdueCheckIn = createCheckIn({
        id: createCheckInId(),
        contactId: createContactId(),
        scheduledDate: createScheduledDate(pastDate),
      })

      fakeRepository.checkIns = createCheckInCollection([overdueCheckIn])

      notificationService.permission = 'denied'

      // When/Then
      await expect(detector.execute()).resolves.not.toThrow()
    })
  })
})
