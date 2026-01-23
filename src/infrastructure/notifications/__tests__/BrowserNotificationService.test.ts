import { describe, it, expect, beforeEach } from 'vitest'
import { BrowserNotificationService } from '../BrowserNotificationService'
import {
  NotificationPermission,
  type NotificationOptions,
} from '../NotificationService'

// Test double for browser Notification API
class FakeNotificationAPI {
  public permission: NotificationPermission = NotificationPermission.Default
  public requestWasCalled = false
  public lastNotificationOptions: NotificationOptions | null = null
  public showNotificationWasCalled = false

  async requestPermission(): Promise<NotificationPermission> {
    this.requestWasCalled = true
    return this.permission
  }

  getPermission(): NotificationPermission {
    return this.permission
  }

  showNotification(options: NotificationOptions): void {
    this.showNotificationWasCalled = true
    this.lastNotificationOptions = options
  }

  isSupported(): boolean {
    return true
  }

  setPermission(permission: NotificationPermission): void {
    this.permission = permission
  }
}

describe('BrowserNotificationService', () => {
  let service: BrowserNotificationService
  let fakeAPI: FakeNotificationAPI

  beforeEach(() => {
    fakeAPI = new FakeNotificationAPI()
    service = new BrowserNotificationService(fakeAPI)
  })

  describe('requestPermission', () => {
    it('should request permission from browser', async () => {
      // Given
      fakeAPI.setPermission(NotificationPermission.Granted)

      // When
      const result = await service.requestPermission()

      // Then
      expect(fakeAPI.requestWasCalled).toBe(true)
      expect(result).toBe(NotificationPermission.Granted)
    })

    it('should return denied when user denies permission', async () => {
      // Given
      fakeAPI.setPermission(NotificationPermission.Denied)

      // When
      const result = await service.requestPermission()

      // Then
      expect(result).toBe(NotificationPermission.Denied)
    })
  })

  describe('getPermission', () => {
    it('should return current permission status', () => {
      // Given
      fakeAPI.setPermission(NotificationPermission.Granted)

      // When
      const result = service.getPermission()

      // Then
      expect(result).toBe(NotificationPermission.Granted)
    })

    it('should return default when no permission requested', () => {
      // Given
      fakeAPI.setPermission(NotificationPermission.Default)

      // When
      const result = service.getPermission()

      // Then
      expect(result).toBe(NotificationPermission.Default)
    })
  })

  describe('showNotification', () => {
    it('should show notification when permission granted', async () => {
      // Given
      fakeAPI.setPermission(NotificationPermission.Granted)
      const options: NotificationOptions = {
        title: 'Test Notification',
        body: 'This is a test message',
      }

      // When
      await service.showNotification(options)

      // Then
      expect(fakeAPI.showNotificationWasCalled).toBe(true)
      expect(fakeAPI.lastNotificationOptions).toEqual(options)
    })

    it('should throw error when permission denied', async () => {
      // Given
      fakeAPI.setPermission(NotificationPermission.Denied)
      const options: NotificationOptions = {
        title: 'Test Notification',
        body: 'This is a test message',
      }

      // When/Then
      await expect(service.showNotification(options)).rejects.toThrow(
        'Notification permission denied'
      )
    })

    it('should throw error when permission not requested', async () => {
      // Given
      fakeAPI.setPermission(NotificationPermission.Default)
      const options: NotificationOptions = {
        title: 'Test Notification',
        body: 'This is a test message',
      }

      // When/Then
      await expect(service.showNotification(options)).rejects.toThrow(
        'Notification permission not granted'
      )
    })

    it('should include optional tag in notification', async () => {
      // Given
      fakeAPI.setPermission(NotificationPermission.Granted)
      const options: NotificationOptions = {
        title: 'Test Notification',
        body: 'This is a test message',
        tag: 'check-in-reminder',
      }

      // When
      await service.showNotification(options)

      // Then
      expect(fakeAPI.lastNotificationOptions?.tag).toBe('check-in-reminder')
    })

    it('should include optional icon in notification', async () => {
      // Given
      fakeAPI.setPermission(NotificationPermission.Granted)
      const options: NotificationOptions = {
        title: 'Test Notification',
        body: 'This is a test message',
        icon: '/icon.png',
      }

      // When
      await service.showNotification(options)

      // Then
      expect(fakeAPI.lastNotificationOptions?.icon).toBe('/icon.png')
    })
  })

  describe('isSupported', () => {
    it('should return true when notifications supported', () => {
      // When
      const result = service.isSupported()

      // Then
      expect(result).toBe(true)
    })
  })
})
