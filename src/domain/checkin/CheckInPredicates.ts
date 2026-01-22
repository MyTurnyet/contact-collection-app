import type { CheckIn } from './CheckIn'
import { CheckInStatus } from './CheckInStatus'

export function isCompleted(checkIn: CheckIn): boolean {
  return checkIn.status === CheckInStatus.Completed
}

export function isNotCompleted(checkIn: CheckIn): boolean {
  return checkIn.status !== CheckInStatus.Completed
}

export function isScheduled(checkIn: CheckIn): boolean {
  return checkIn.status === CheckInStatus.Scheduled
}

export function isOverdue(checkIn: CheckIn): boolean {
  return checkIn.status === CheckInStatus.Overdue
}
