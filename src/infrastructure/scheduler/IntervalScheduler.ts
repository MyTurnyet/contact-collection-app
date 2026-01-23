import type { SchedulerService, ScheduledTask, TimerAPI } from './SchedulerService'

/**
 * Real browser timer API adapter
 */
export class RealTimerAPI implements TimerAPI {
  setInterval(callback: () => void, intervalMs: number): number {
    return window.setInterval(callback, intervalMs)
  }

  clearInterval(id: number): void {
    window.clearInterval(id)
  }
}

/**
 * Interval-based scheduler implementation.
 * Executes a task immediately and then repeatedly at fixed intervals.
 */
export class IntervalScheduler implements SchedulerService {
  private timerId: number | null = null
  private task: ScheduledTask | null = null
  private readonly timerAPI: TimerAPI
  private readonly intervalMs: number

  constructor(timerAPI: TimerAPI, intervalMs: number) {
    this.timerAPI = timerAPI
    this.intervalMs = intervalMs
  }

  start(task: ScheduledTask): void {
    if (this.isRunning()) {
      return
    }
    this.task = task
    this.executeTaskSafely()
    this.scheduleInterval()
  }

  stop(): void {
    this.clearTimer()
    this.task = null
  }

  isRunning(): boolean {
    return this.timerId !== null
  }

  private scheduleInterval(): void {
    this.timerId = this.timerAPI.setInterval(
      () => this.executeTaskSafely(),
      this.intervalMs
    )
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      this.timerAPI.clearInterval(this.timerId)
      this.timerId = null
    }
  }

  private executeTaskSafely(): void {
    if (this.task) {
      this.task.execute().catch((error) => {
        console.error('Scheduled task error:', error)
      })
    }
  }
}
