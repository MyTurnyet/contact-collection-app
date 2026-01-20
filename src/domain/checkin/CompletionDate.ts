export type CompletionDate = Date & { readonly __brand: 'CompletionDate' }

export function createCompletionDate(date: Date): CompletionDate {
  validateDate(date)
  return date as CompletionDate
}

function validateDate(date: Date): void {
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date')
  }
}

export function completionDateEquals(
  a: CompletionDate,
  b: CompletionDate
): boolean {
  return a.getTime() === b.getTime()
}

const NULL_DATE = new Date(0)

const NULL_COMPLETION_DATE: CompletionDate = NULL_DATE as CompletionDate

export function createNullCompletionDate(): CompletionDate {
  return NULL_COMPLETION_DATE
}

export function isNullCompletionDate(date: CompletionDate): boolean {
  return date === NULL_COMPLETION_DATE
}
