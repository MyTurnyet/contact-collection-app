/**
 * Scheduler service abstraction for running periodic background tasks.
 * Used for checking overdue check-ins and dispatching notifications.
 */

export interface ScheduledTask {
  /**
   * Executes the scheduled task.
   */
  execute(): Promise<void>
}

export interface SchedulerService {
  /**
   * Starts the scheduler to run tasks periodically.
   * @param task The task to run on schedule
   */
  start(task: ScheduledTask): void

  /**
   * Stops the scheduler.
   */
  stop(): void

  /**
   * Checks if the scheduler is currently running.
   */
  isRunning(): boolean
}

/**
 * Timer abstraction for dependency injection and testing.
 */
export interface TimerAPI {
  /**
   * Sets an interval to run a callback repeatedly.
   * @param callback The function to execute
   * @param intervalMs The interval in milliseconds
   * @returns A timer ID that can be used to clear the interval
   */
  setInterval(callback: () => void, intervalMs: number): number

  /**
   * Clears an interval by ID.
   * @param id The timer ID to clear
   */
  clearInterval(id: number): void
}
