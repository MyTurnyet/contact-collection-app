import { getStartOfDay, isDateBefore } from '../services'

declare const __brand: unique symbol
type Brand<T, TBrand> = T & { [__brand]: TBrand }

export type DateRange = Brand<
  {
    readonly start: Date
    readonly end: Date
  },
  'DateRange'
>

export function createDateRange(start: Date, end: Date): DateRange {
  const startDay = getStartOfDay(start)
  const endDay = getStartOfDay(end)

  if (isDateBefore(endDay, startDay)) {
    throw new Error('DateRange start date must be before or equal to end date')
  }

  return Object.freeze({
    start: startDay,
    end: endDay,
  }) as DateRange
}

export function isDateInRange(date: Date, range: DateRange): boolean {
  const dateDay = getStartOfDay(date)
  return !isDateBefore(dateDay, range.start) && !isDateBefore(range.end, dateDay)
}

export function dateRangeEquals(a: DateRange, b: DateRange): boolean {
  return a.start.getTime() === b.start.getTime() && a.end.getTime() === b.end.getTime()
}
