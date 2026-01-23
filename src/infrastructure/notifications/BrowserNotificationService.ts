import {
  type NotificationService,
  type NotificationOptions,
  NotificationPermission,
} from './NotificationService'

/**
 * Browser Notification API abstraction for dependency injection
 */
export interface BrowserNotificationAPI {
  requestPermission(): Promise<NotificationPermission>
  getPermission(): NotificationPermission
  showNotification(options: NotificationOptions): void
  isSupported(): boolean
}

/**
 * Real browser notification API adapter
 */
export class RealBrowserNotificationAPI implements BrowserNotificationAPI {
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      return 'denied'
    }
    const result = await Notification.requestPermission()
    return this.mapPermission(result)
  }

  getPermission(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied'
    }
    return this.mapPermission(Notification.permission)
  }

  showNotification(options: NotificationOptions): void {
    new Notification(options.title, {
      body: options.body,
      tag: options.tag,
      icon: options.icon,
    })
  }

  isSupported(): boolean {
    return typeof Notification !== 'undefined'
  }

  private mapPermission(
    permission: globalThis.NotificationPermission
  ): NotificationPermission {
    return permission as NotificationPermission
  }
}

/**
 * Browser notification service implementation
 */
export class BrowserNotificationService implements NotificationService {
  private api: BrowserNotificationAPI

  constructor(api: BrowserNotificationAPI) {
    this.api = api
  }

  async requestPermission(): Promise<NotificationPermission> {
    return await this.api.requestPermission()
  }

  getPermission(): NotificationPermission {
    return this.api.getPermission()
  }

  async showNotification(options: NotificationOptions): Promise<void> {
    this.validatePermission()
    this.api.showNotification(options)
  }

  isSupported(): boolean {
    return this.api.isSupported()
  }

  private validatePermission(): void {
    const permission = this.getPermission()
    if (permission === 'denied') {
      throw new Error('Notification permission denied')
    }
    if (permission !== 'granted') {
      throw new Error('Notification permission not granted')
    }
  }
}
