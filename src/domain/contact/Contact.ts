import {
  type ContactId,
  contactIdEquals,
  contactIdFromString,
} from './ContactId'
import {
  type PhoneNumber,
  phoneNumberEquals,
  createNullPhoneNumber,
} from './PhoneNumber'
import {
  type EmailAddress,
  emailAddressEquals,
  createNullEmailAddress,
} from './EmailAddress'
import { type Location, locationEquals, createNullLocation } from './Location'
import {
  type RelationshipContext,
  relationshipContextEquals,
  createNullRelationshipContext,
} from './RelationshipContext'
import type ImportantDateCollection from './collections/ImportantDateCollection'
import { createImportantDateCollection } from './collections/ImportantDateCollection'
import {
  type CategoryId,
  categoryIdEquals,
  createNullCategoryId,
} from '../category/CategoryId'

export interface Contact {
  readonly id: ContactId
  readonly name: string
  readonly phone: PhoneNumber
  readonly email: EmailAddress
  readonly location: Location
  readonly relationshipContext: RelationshipContext
  readonly categoryId: CategoryId
  readonly importantDates: ImportantDateCollection
}

interface ContactInput {
  id: ContactId
  name: string
  phone?: PhoneNumber
  email?: EmailAddress
  location?: Location
  relationshipContext?: RelationshipContext
  categoryId?: CategoryId
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
    phone: input.phone ?? createNullPhoneNumber(),
    email: input.email ?? createNullEmailAddress(),
    location: input.location ?? createNullLocation(),
    relationshipContext: input.relationshipContext ?? createNullRelationshipContext(),
    categoryId: input.categoryId ?? createNullCategoryId(),
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
    phoneNumberEquals(a.phone, b.phone) &&
    emailAddressEquals(a.email, b.email) &&
    locationEquals(a.location, b.location) &&
    relationshipContextEquals(a.relationshipContext, b.relationshipContext) &&
    categoryIdEquals(a.categoryId, b.categoryId) &&
    a.importantDates === b.importantDates
  )
}

const NULL_CONTACT: Contact = Object.freeze({
  id: contactIdFromString('00000000-0000-0000-0000-000000000000'),
  name: '',
  phone: createNullPhoneNumber(),
  email: createNullEmailAddress(),
  location: createNullLocation(),
  relationshipContext: createNullRelationshipContext(),
  categoryId: createNullCategoryId(),
  importantDates: createImportantDateCollection([]),
})

export function createNullContact(): Contact {
  return NULL_CONTACT
}

export function isNullContact(contact: Contact): boolean {
  return contact === NULL_CONTACT
}
