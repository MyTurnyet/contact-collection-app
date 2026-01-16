// Value Objects
export { type ContactId, createContactId, contactIdFromString } from './ContactId'
export { type PhoneNumber, createPhoneNumber } from './PhoneNumber'
export { type EmailAddress, createEmailAddress } from './EmailAddress'
export { type Location, createLocation } from './Location'
export { type RelationshipContext, createRelationshipContext } from './RelationshipContext'
export { type ImportantDate, createImportantDate } from './ImportantDate'
export { default as ImportantDateCollection, createImportantDateCollection } from './collections/ImportantDateCollection.ts'
export { default as ContactCollection, createContactCollection } from './collections/ContactCollection'

// Entity
export { type Contact, createContact } from './Contact'

// Repository Interface
export { type ContactRepository } from './ContactRepository'
