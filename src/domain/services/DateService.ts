import { startOfDay, isBefore, isSameDay, isWithinInterval, addDays } from 'date-fns'

export function getStartOfDay(date: Date): Date {
  return startOfDay(date)
}

export function isDateBefore(date: Date, comparison: Date): boolean {
  return isBefore(startOfDay(date), startOfDay(comparison))
}

export function areSameDay(date1: Date, date2: Date): boolean {
  return isSameDay(startOfDay(date1), startOfDay(date2))
}

export function isDateBetween(date: Date, start: Date, end: Date): boolean {
  const dateDay = startOfDay(date)
  const startDay = startOfDay(start)
  const endDay = startOfDay(end)
  return isWithinInterval(dateDay, { start: startDay, end: endDay })
}

export function addDaysToDate(date: Date, days: number): Date {
  return addDays(date, days)
}
