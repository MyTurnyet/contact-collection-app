import type { ScheduledTask } from './SchedulerService'
import type { GetOverdueCheckIns } from '../../application/checkins/GetOverdueCheckIns'
import type { NotificationService } from '../notifications/NotificationService'

/**
 * Scheduled task that detects overdue check-ins and sends notifications.
 * Integrates the GetOverdueCheckIns use case with the notification service.
 */
export class OverdueCheckInDetector implements ScheduledTask {
  private readonly getOverdueCheckIns: GetOverdueCheckIns
  private readonly notificationService: NotificationService

  constructor(getOverdueCheckIns: GetOverdueCheckIns, notificationService: NotificationService) {
    this.getOverdueCheckIns = getOverdueCheckIns
    this.notificationService = notificationService
  }

  async execute(): Promise<void> {
    const overdueCheckIns = await this.getOverdueCheckIns.execute()
    await this.notifyIfOverdue(overdueCheckIns.size)
  }

  private async notifyIfOverdue(count: number): Promise<void> {
    if (count === 0) {
      return
    }
    await this.sendNotification(count)
  }

  private async sendNotification(count: number): Promise<void> {
    try {
      await this.notificationService.showNotification({
        title: `${count} Overdue Check-in${this.pluralize(count)}`,
        body: this.createNotificationBody(count),
        tag: 'overdue-checkins',
      })
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  private createNotificationBody(count: number): string {
    const verb = count === 1 ? 'is' : 'are'
    return `You have ${count} check-in${this.pluralize(count)} that ${verb} overdue.`
  }

  private pluralize(count: number): string {
    return count === 1 ? '' : 's'
  }
}
