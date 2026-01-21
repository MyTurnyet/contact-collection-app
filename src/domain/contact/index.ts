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
  createNullEmailAddress,
  isNullEmailAddress,
} from './EmailAddress'
export {
  type Location,
  createLocation,
  locationEquals,
  createNullLocation,
  isNullLocation,
} from './Location'
export {
  type RelationshipContext,
  createRelationshipContext,
  relationshipContextEquals,
  createNullRelationshipContext,
  isNullRelationshipContext,
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

// Category (from category domain)
export {
  type CategoryId,
  createCategoryId,
  categoryIdFromString,
  categoryIdEquals,
  createNullCategoryId,
  isNullCategoryId,
} from '../category/CategoryId'

// Entity
export {
  type Contact,
  createContact,
  contactEquals,
  createNullContact,
  isNullContact,
} from './Contact'

// Repository Interface
export { type ContactRepository } from './ContactRepository'
