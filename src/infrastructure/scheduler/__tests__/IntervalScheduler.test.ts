import { describe, it, expect, beforeEach } from 'vitest'
import { IntervalScheduler } from '../IntervalScheduler'
import type { ScheduledTask, TimerAPI } from '../SchedulerService'

// Test double for TimerAPI
class FakeTimerAPI implements TimerAPI {
  private nextId = 1
  private intervals: Map<number, { callback: () => void; intervalMs: number }> =
    new Map()
  public clearedIds: number[] = []

  setInterval(callback: () => void, intervalMs: number): number {
    const id = this.nextId++
    this.intervals.set(id, { callback, intervalMs })
    return id
  }

  clearInterval(id: number): void {
    this.intervals.delete(id)
    this.clearedIds.push(id)
  }

  // Test helper to manually trigger intervals
  triggerInterval(id: number): void {
    const interval = this.intervals.get(id)
    if (interval) {
      interval.callback()
    }
  }

  getActiveIntervals(): number {
    return this.intervals.size
  }

  getIntervalMs(id: number): number | undefined {
    return this.intervals.get(id)?.intervalMs
  }
}

// Test double for ScheduledTask
class FakeScheduledTask implements ScheduledTask {
  public executionCount = 0
  public shouldThrow = false

  async execute(): Promise<void> {
    if (this.shouldThrow) {
      throw new Error('Task execution failed')
    }
    this.executionCount++
  }

  reset(): void {
    this.executionCount = 0
    this.shouldThrow = false
  }
}

describe('IntervalScheduler', () => {
  let scheduler: IntervalScheduler
  let timerAPI: FakeTimerAPI
  let task: FakeScheduledTask

  beforeEach(() => {
    timerAPI = new FakeTimerAPI()
    task = new FakeScheduledTask()
    scheduler = new IntervalScheduler(timerAPI, 6 * 60 * 60 * 1000) // 6 hours
  })

  describe('start', () => {
    it('should start the scheduler', () => {
      // When
      scheduler.start(task)

      // Then
      expect(scheduler.isRunning()).toBe(true)
    })

    it('should set interval with correct duration', () => {
      // When
      scheduler.start(task)

      // Then
      expect(timerAPI.getActiveIntervals()).toBe(1)
      const intervalMs = timerAPI.getIntervalMs(1)
      expect(intervalMs).toBe(6 * 60 * 60 * 1000) // 6 hours in ms
    })

    it('should execute task immediately on start', async () => {
      // When
      scheduler.start(task)
      await new Promise((resolve) => setTimeout(resolve, 0))

      // Then
      expect(task.executionCount).toBe(1)
    })

    it('should execute task on interval trigger', async () => {
      // Given
      scheduler.start(task)
      await new Promise((resolve) => setTimeout(resolve, 0))
      task.reset()

      // When
      timerAPI.triggerInterval(1)
      await new Promise((resolve) => setTimeout(resolve, 0))

      // Then
      expect(task.executionCount).toBe(1)
    })

    it('should not start if already running', () => {
      // Given
      scheduler.start(task)

      // When
      scheduler.start(task)

      // Then
      expect(timerAPI.getActiveIntervals()).toBe(1)
    })
  })

  describe('stop', () => {
    it('should stop the scheduler', () => {
      // Given
      scheduler.start(task)

      // When
      scheduler.stop()

      // Then
      expect(scheduler.isRunning()).toBe(false)
    })

    it('should clear the interval', () => {
      // Given
      scheduler.start(task)

      // When
      scheduler.stop()

      // Then
      expect(timerAPI.clearedIds.length).toBe(1)
    })

    it('should not execute task after stopping', async () => {
      // Given
      scheduler.start(task)
      await new Promise((resolve) => setTimeout(resolve, 0))
      scheduler.stop()
      task.reset()

      // When
      timerAPI.triggerInterval(1)
      await new Promise((resolve) => setTimeout(resolve, 0))

      // Then
      expect(task.executionCount).toBe(0)
    })

    it('should handle stop when not running', () => {
      // When/Then
      expect(() => scheduler.stop()).not.toThrow()
    })
  })

  describe('isRunning', () => {
    it('should return false initially', () => {
      // When
      const result = scheduler.isRunning()

      // Then
      expect(result).toBe(false)
    })

    it('should return true when running', () => {
      // Given
      scheduler.start(task)

      // When
      const result = scheduler.isRunning()

      // Then
      expect(result).toBe(true)
    })

    it('should return false after stopped', () => {
      // Given
      scheduler.start(task)
      scheduler.stop()

      // When
      const result = scheduler.isRunning()

      // Then
      expect(result).toBe(false)
    })
  })

  describe('error handling', () => {
    it('should continue running if task throws error', async () => {
      // Given
      task.shouldThrow = true
      scheduler.start(task)
      await new Promise((resolve) => setTimeout(resolve, 0))

      // When/Then - scheduler should still be running
      expect(scheduler.isRunning()).toBe(true)
    })
  })
})
