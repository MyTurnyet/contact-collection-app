import {
  createUuidValueObject,
  uuidValueObjectFromString,
  uuidValueObjectEquals,
} from '../shared/UuidValueObject'

export type ContactId = string & { readonly __brand: 'ContactId' }

export function createContactId(): ContactId {
  return createUuidValueObject<ContactId>()
}

export function contactIdFromString(value: string): ContactId {
  return uuidValueObjectFromString<ContactId>(value, 'ContactId')
}

export function contactIdEquals(a: ContactId, b: ContactId): boolean {
  return uuidValueObjectEquals(a, b)
}
