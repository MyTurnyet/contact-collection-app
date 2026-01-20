export type ScheduledDate = Date & { readonly __brand: 'ScheduledDate' }

export function createScheduledDate(date: Date): ScheduledDate {
  validateDate(date)
  return date as ScheduledDate
}

function validateDate(date: Date): void {
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date')
  }
}

export function scheduledDateEquals(
  a: ScheduledDate,
  b: ScheduledDate
): boolean {
  return a.getTime() === b.getTime()
}

const NULL_DATE = new Date(0)

const NULL_SCHEDULED_DATE: ScheduledDate = NULL_DATE as ScheduledDate

export function createNullScheduledDate(): ScheduledDate {
  return NULL_SCHEDULED_DATE
}

export function isNullScheduledDate(date: ScheduledDate): boolean {
  return date === NULL_SCHEDULED_DATE
}
