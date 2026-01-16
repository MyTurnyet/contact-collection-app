import {
  type Contact,
  type ContactId,
  type ContactRepository,
  type ContactCollection,
  createContactCollection,
} from '../../../domain/contact'

export class InMemoryContactRepository implements ContactRepository {
  private contacts: Map<string, Contact> = new Map()

  async save(contact: Contact): Promise<void> {
    this.contacts.set(contact.id, contact)
  }

  async findById(id: ContactId): Promise<Contact | null> {
    return this.contacts.get(id) || null
  }

  async findAll(): Promise<ContactCollection> {
    const allContacts = Array.from(this.contacts.values())
    return createContactCollection(allContacts)
  }

  async delete(id: ContactId): Promise<void> {
    this.contacts.delete(id)
  }

  async search(query: string): Promise<ContactCollection> {
    const lowerQuery = query.toLowerCase()
    const matches = Array.from(this.contacts.values()).filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowerQuery) ||
        (contact.email?.toLowerCase().includes(lowerQuery) ?? false)
    )
    return createContactCollection(matches)
  }

  clear(): void {
    this.contacts.clear()
  }
}
