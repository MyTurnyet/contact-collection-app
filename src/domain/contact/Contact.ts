import { type ContactId, contactIdEquals } from './ContactId'
import { type PhoneNumber, phoneNumberEquals } from './PhoneNumber'
import { type EmailAddress, emailAddressEquals } from './EmailAddress'
import { type Location, locationEquals } from './Location'
import {
  type RelationshipContext,
  relationshipContextEquals,
} from './RelationshipContext'
import type ImportantDateCollection from './collections/ImportantDateCollection'
import { createImportantDateCollection } from './collections/ImportantDateCollection'

export interface Contact {
  readonly id: ContactId
  readonly name: string
  readonly phone?: PhoneNumber
  readonly email?: EmailAddress
  readonly location?: Location
  readonly relationshipContext?: RelationshipContext
  readonly importantDates: ImportantDateCollection
}

interface ContactInput {
  id: ContactId
  name: string
  phone?: PhoneNumber
  email?: EmailAddress
  location?: Location
  relationshipContext?: RelationshipContext
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
    phone: input.phone,
    email: input.email,
    location: input.location,
    relationshipContext: input.relationshipContext,
  }
}

function validateName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new Error('Name is required')
  }
}

export function contactEquals(a: Contact, b: Contact): boolean {
  return (
    contactIdEquals(a.id, b.id) &&
    a.name === b.name &&
    optionalPhoneEquals(a.phone, b.phone) &&
    optionalEmailEquals(a.email, b.email) &&
    optionalLocationEquals(a.location, b.location) &&
    optionalRelationshipEquals(a.relationshipContext, b.relationshipContext) &&
    a.importantDates === b.importantDates
  )
}

function optionalPhoneEquals(a?: PhoneNumber, b?: PhoneNumber): boolean {
  if (a === undefined && b === undefined) return true
  if (a === undefined || b === undefined) return false
  return phoneNumberEquals(a, b)
}

function optionalEmailEquals(a?: EmailAddress, b?: EmailAddress): boolean {
  if (a === undefined && b === undefined) return true
  if (a === undefined || b === undefined) return false
  return emailAddressEquals(a, b)
}

function optionalLocationEquals(a?: Location, b?: Location): boolean {
  if (a === undefined && b === undefined) return true
  if (a === undefined || b === undefined) return false
  return locationEquals(a, b)
}

function optionalRelationshipEquals(
  a?: RelationshipContext,
  b?: RelationshipContext
): boolean {
  if (a === undefined && b === undefined) return true
  if (a === undefined || b === undefined) return false
  return relationshipContextEquals(a, b)
}
