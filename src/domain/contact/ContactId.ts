import { v4 as uuidv4, validate as validateUuid } from 'uuid'

export type ContactId = string & { readonly __brand: 'ContactId' }

export function createContactId(): ContactId {
  return uuidv4() as ContactId
}

export function contactIdFromString(value: string): ContactId {
  if (!isValidUuid(value)) {
    throw new Error('Invalid ContactId format')
  }
  return value as ContactId
}

function isValidUuid(value: string): boolean {
  return value.length > 0 && validateUuid(value)
}
