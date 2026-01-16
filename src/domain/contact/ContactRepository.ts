import { type Contact } from './Contact'
import { type ContactId } from './ContactId'
import type ContactCollection from './collections/ContactCollection'

export interface ContactRepository {
  save(contact: Contact): Promise<void>
  findById(id: ContactId): Promise<Contact | null>
  findAll(): Promise<ContactCollection>
  delete(id: ContactId): Promise<void>
  search(query: string): Promise<ContactCollection>
}
