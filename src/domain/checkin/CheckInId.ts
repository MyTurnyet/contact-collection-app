import {
  createUuidValueObject,
  uuidValueObjectFromString,
  uuidValueObjectEquals,
} from '../shared/UuidValueObject'

export type CheckInId = string & { readonly __brand: 'CheckInId' }

export function createCheckInId(): CheckInId {
  return createUuidValueObject<CheckInId>()
}

export function checkInIdFromString(value: string): CheckInId {
  return uuidValueObjectFromString<CheckInId>(value, 'CheckInId')
}

export function checkInIdEquals(a: CheckInId, b: CheckInId): boolean {
  return uuidValueObjectEquals(a, b)
}
