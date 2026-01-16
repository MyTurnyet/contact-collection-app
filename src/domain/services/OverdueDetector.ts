import { isBefore, startOfDay } from 'date-fns'

export function isOverdue(scheduledDate: Date, currentDate: Date): boolean {
  return isScheduledBeforeCurrent(scheduledDate, currentDate)
}

function isScheduledBeforeCurrent(
  scheduledDate: Date,
  currentDate: Date
): boolean {
  const scheduledDay = startOfDay(scheduledDate)
  const currentDay = startOfDay(currentDate)
  return isBefore(scheduledDay, currentDay)
}
