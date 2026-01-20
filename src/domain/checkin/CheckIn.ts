import { type CheckInId, checkInIdEquals, checkInIdFromString } from './CheckInId'
import { type ContactId, contactIdEquals, contactIdFromString } from '../contact'
import {
  type ScheduledDate,
  scheduledDateEquals,
  createNullScheduledDate,
} from './ScheduledDate'
import {
  type CompletionDate,
  completionDateEquals,
  createNullCompletionDate,
  isNullCompletionDate,
} from './CompletionDate'
import {
  type CheckInNotes,
  checkInNotesEquals,
  createNullCheckInNotes,
} from './CheckInNotes'
import { CheckInStatus } from './CheckInStatus'

export interface CheckIn {
  readonly id: CheckInId
  readonly contactId: ContactId
  readonly scheduledDate: ScheduledDate
  readonly completionDate: CompletionDate
  readonly notes: CheckInNotes
  readonly status: CheckInStatus
}

interface CheckInInput {
  id: CheckInId
  contactId: ContactId
  scheduledDate: ScheduledDate
  completionDate?: CompletionDate
  notes?: CheckInNotes
}

export function createCheckIn(input: CheckInInput): CheckIn {
  return Object.freeze(buildCheckIn(input))
}

function buildCheckIn(input: CheckInInput): CheckIn {
  const baseCheckIn = buildBaseCheckIn(input)
  const status = calculateStatus(baseCheckIn)
  return { ...baseCheckIn, status }
}

function buildBaseCheckIn(input: CheckInInput) {
  return {
    id: input.id,
    contactId: input.contactId,
    scheduledDate: input.scheduledDate,
    completionDate: getCompletionDate(input),
    notes: getNotes(input),
  }
}

function getCompletionDate(input: CheckInInput): CompletionDate {
  return input.completionDate ?? createNullCompletionDate()
}

function getNotes(input: CheckInInput): CheckInNotes {
  return input.notes ?? createNullCheckInNotes()
}

function calculateStatus(checkIn: Omit<CheckIn, 'status'>): CheckInStatus {
  if (isCompleted(checkIn.completionDate)) {
    return CheckInStatus.Completed
  }
  return isOverdue(checkIn.scheduledDate)
}

function isCompleted(completionDate: CompletionDate): boolean {
  return !isNullCompletionDate(completionDate)
}

function isOverdue(scheduledDate: ScheduledDate): CheckInStatus {
  const now = new Date()
  if (scheduledDate < now) {
    return CheckInStatus.Overdue
  }
  return CheckInStatus.Scheduled
}

export function checkInEquals(a: CheckIn, b: CheckIn): boolean {
  return (
    checkInIdEquals(a.id, b.id) &&
    contactIdEquals(a.contactId, b.contactId) &&
    scheduledDateEquals(a.scheduledDate, b.scheduledDate) &&
    completionDateEquals(a.completionDate, b.completionDate) &&
    checkInNotesEquals(a.notes, b.notes)
  )
}

const NULL_CHECK_IN: CheckIn = Object.freeze({
  id: checkInIdFromString('00000000-0000-0000-0000-000000000000'),
  contactId: contactIdFromString('00000000-0000-0000-0000-000000000000'),
  scheduledDate: createNullScheduledDate(),
  completionDate: createNullCompletionDate(),
  notes: createNullCheckInNotes(),
  status: CheckInStatus.Scheduled,
})

export function createNullCheckIn(): CheckIn {
  return NULL_CHECK_IN
}

export function isNullCheckIn(checkIn: CheckIn): boolean {
  return checkIn === NULL_CHECK_IN
}
