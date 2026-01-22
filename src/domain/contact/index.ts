// Value Objects - Types
export type { ContactId } from './ContactId'
export type { PhoneNumber } from './PhoneNumber'
export type { EmailAddress } from './EmailAddress'
export type { Location } from './Location'
export type { RelationshipContext } from './RelationshipContext'
export type { ImportantDate } from './ImportantDate'
export type { CategoryId } from '../category/CategoryId'
export type { Contact } from './Contact'
export type { ContactRepository } from './ContactRepository'

// Value Objects - Values
export {
  createContactId,
  contactIdFromString,
  contactIdEquals,
} from './ContactId'
export {
  createPhoneNumber,
  phoneNumberEquals,
  createNullPhoneNumber,
  isNullPhoneNumber,
} from './PhoneNumber'
export {
  createEmailAddress,
  emailAddressEquals,
  createNullEmailAddress,
  isNullEmailAddress,
} from './EmailAddress'
export {
  createLocation,
  locationEquals,
  createNullLocation,
  isNullLocation,
} from './Location'
export {
  createRelationshipContext,
  relationshipContextEquals,
  createNullRelationshipContext,
  isNullRelationshipContext,
} from './RelationshipContext'
export {
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

// Category (from category domain) - Values
export {
  createCategoryId,
  categoryIdFromString,
  categoryIdEquals,
  createNullCategoryId,
  isNullCategoryId,
} from '../category/CategoryId'

// Entity - Values
export {
  createContact,
  contactEquals,
  createNullContact,
  isNullContact,
} from './Contact'
