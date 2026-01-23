// Interfaces
export type {
  NotificationService,
  NotificationOptions,
} from './NotificationService'
export { NotificationPermission } from './NotificationService'

export type {
  BrowserNotificationAPI,
} from './BrowserNotificationService'
export {
  BrowserNotificationService,
  RealBrowserNotificationAPI,
} from './BrowserNotificationService'

// Email
export type { EmailMessage, ConsoleLogger } from './EmailSimulator'
export { EmailSimulator, RealConsole } from './EmailSimulator'
