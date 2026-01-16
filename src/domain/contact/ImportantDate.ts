export interface ImportantDate {
  readonly date: Date
  readonly description: string
}

interface ImportantDateInput {
  date: Date
  description: string
}

export function createImportantDate(
  input: ImportantDateInput
): ImportantDate {
  validateImportantDate(input)
  return Object.freeze(createDateObject(input))
}

function validateImportantDate(input: ImportantDateInput): void {
  validateDate(input.date)
  validateDescription(input.description)
}

function createDateObject(input: ImportantDateInput): ImportantDate {
  return {
    date: input.date,
    description: input.description.trim(),
  }
}

function validateDate(date: Date): void {
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date')
  }
}

function validateDescription(description: string): void {
  if (!description || description.trim().length === 0) {
    throw new Error('Description is required')
  }
}

export function importantDateEquals(
  a: ImportantDate,
  b: ImportantDate
): boolean {
  return (
    a.date.getTime() === b.date.getTime() &&
    a.description === b.description
  )
}
