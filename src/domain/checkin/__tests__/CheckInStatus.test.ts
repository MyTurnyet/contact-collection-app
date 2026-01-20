import { describe, it, expect } from 'vitest'
import { CheckInStatus } from '../CheckInStatus'

describe('CheckInStatus', () => {
  it('should have Scheduled status', () => {
    expect(CheckInStatus.Scheduled).toBeDefined()
    expect(CheckInStatus.Scheduled).toBe('Scheduled')
  })

  it('should have Completed status', () => {
    expect(CheckInStatus.Completed).toBeDefined()
    expect(CheckInStatus.Completed).toBe('Completed')
  })

  it('should have Overdue status', () => {
    expect(CheckInStatus.Overdue).toBeDefined()
    expect(CheckInStatus.Overdue).toBe('Overdue')
  })

  it('should have exactly three statuses', () => {
    const statusValues = Object.values(CheckInStatus)

    expect(statusValues).toHaveLength(3)
  })

  it('should allow status comparison', () => {
    const status1 = CheckInStatus.Scheduled
    const status2 = CheckInStatus.Scheduled

    expect(status1 === status2).toBe(true)
  })

  it('should differentiate between different statuses', () => {
    const scheduled = CheckInStatus.Scheduled
    const completed = CheckInStatus.Completed
    const overdue = CheckInStatus.Overdue

    expect(scheduled).not.toBe(completed)
    expect(scheduled).not.toBe(overdue)
    expect(completed).not.toBe(overdue)
  })
})
