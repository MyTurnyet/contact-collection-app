// Value Objects
export {
  type ContactId,
  createContactId,
  contactIdFromString,
  contactIdEquals,
} from './ContactId'
export {
  type PhoneNumber,
  createPhoneNumber,
  phoneNumberEquals,
  createNullPhoneNumber,
  isNullPhoneNumber,
} from './PhoneNumber'
export {
  type EmailAddress,
  createEmailAddress,
  emailAddressEquals,
} from './EmailAddress'
export { type Location, createLocation, locationEquals } from './Location'
export {
  type RelationshipContext,
  createRelationshipContext,
  relationshipContextEquals,
} from './RelationshipContext'
export {
  type ImportantDate,
  createImportantDate,
  importantDateEquals,
} from './ImportantDate'
export {
  default as ImportantDateCollection,
  createImportantDateCollection,
} from './collections/ImportantDateCollection'
export {
  default as ContactCollection,
  createContactCollection,
} from './collections/ContactCollection'

// Entity
export { type Contact, createContact, contactEquals } from './Contact'

// Repository Interface
export { type ContactRepository } from './ContactRepository'
