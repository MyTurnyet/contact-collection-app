import { addDays, addWeeks, addMonths } from 'date-fns'
import { type CheckInFrequency } from '../category/CheckInFrequency'

export function calculateNextCheckIn(
  baseDate: Date,
  frequency: CheckInFrequency
): Date {
  return addFrequencyToDate(baseDate, frequency)
}

function addFrequencyToDate(
  date: Date,
  frequency: CheckInFrequency
): Date {
  switch (frequency.unit) {
    case 'days':
      return addDays(date, frequency.value)
    case 'weeks':
      return addWeeks(date, frequency.value)
    case 'months':
      return addMonths(date, frequency.value)
  }
}
