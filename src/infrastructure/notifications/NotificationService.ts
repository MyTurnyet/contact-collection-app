/**
 * Notification service abstraction for sending notifications to users.
 * Implementations can use browser notifications, email, SMS, etc.
 */

export const NotificationPermission = {
  Granted: 'granted',
  Denied: 'denied',
  Default: 'default',
} as const

export type NotificationPermission = typeof NotificationPermission[keyof typeof NotificationPermission]

export interface NotificationOptions {
  readonly title: string
  readonly body: string
  readonly tag?: string
  readonly icon?: string
}

export interface NotificationService {
  /**
   * Requests permission to send notifications.
   * @returns The permission status after the request
   */
  requestPermission(): Promise<NotificationPermission>

  /**
   * Gets the current permission status.
   * @returns The current permission status
   */
  getPermission(): NotificationPermission

  /**
   * Shows a notification to the user.
   * @param options The notification options
   * @throws Error if permission is not granted
   */
  showNotification(options: NotificationOptions): Promise<void>

  /**
   * Checks if notifications are supported in the current environment.
   * @returns true if notifications are supported
   */
  isSupported(): boolean
}
