import { type ContactId } from './ContactId'
import { type PhoneNumber } from './PhoneNumber'
import { type EmailAddress } from './EmailAddress'
import { type Location } from './Location'
import { type RelationshipContext } from './RelationshipContext'
import type ImportantDateCollection from './collections/ImportantDateCollection.ts'
import { createImportantDateCollection } from './collections/ImportantDateCollection.ts'

export interface Contact {
  readonly id: ContactId
  readonly name: string
  readonly phoneNumber: PhoneNumber
  readonly emailAddress: EmailAddress
  readonly location: Location
  readonly relationshipContext: RelationshipContext
  readonly importantDates: ImportantDateCollection
}

interface ContactInput {
  id: ContactId
  name: string
  phoneNumber: PhoneNumber
  emailAddress: EmailAddress
  location: Location
  relationshipContext: RelationshipContext
  importantDates?: ImportantDateCollection
}

export function createContact(input: ContactInput): Contact {
  validateContact(input)
  return Object.freeze(buildContact(input))
}

function validateContact(input: ContactInput): void {
  validateName(input.name)
}

function buildContact(input: ContactInput): Contact {
  const baseContact = buildBaseContact(input)
  const dates = getImportantDates(input)
  return { ...baseContact, importantDates: dates }
}

function getImportantDates(input: ContactInput) {
  return input.importantDates ?? createImportantDateCollection([])
}

function buildBaseContact(input: ContactInput) {
  return {
    id: input.id,
    name: input.name.trim(),
    phoneNumber: input.phoneNumber,
    emailAddress: input.emailAddress,
    location: input.location,
    relationshipContext: input.relationshipContext,
  }
}

function validateName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new Error('Name is required')
  }
}
