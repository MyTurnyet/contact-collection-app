export type CheckInNotes = string & { readonly __brand: 'CheckInNotes' }

export function createCheckInNotes(notes: string): CheckInNotes {
  return notes.trim() as CheckInNotes
}

export function checkInNotesEquals(
  a: CheckInNotes,
  b: CheckInNotes
): boolean {
  return a === b
}

const NULL_NOTES: CheckInNotes = '' as CheckInNotes

export function createNullCheckInNotes(): CheckInNotes {
  return NULL_NOTES
}

export function isNullCheckInNotes(notes: CheckInNotes): boolean {
  return notes === NULL_NOTES
}
