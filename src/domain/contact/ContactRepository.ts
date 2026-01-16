import { type Contact } from './Contact'
import { type ContactId } from './ContactId'

export interface ContactRepository {
  save(contact: Contact): Promise<void>
  findById(id: ContactId): Promise<Contact | null>
  findAll(): Promise<Contact[]>
  delete(id: ContactId): Promise<void>
  search(query: string): Promise<Contact[]>
}
