import type { ContactRepository } from '../../domain/contact/ContactRepository'
import type { Contact } from '../../domain/contact/Contact'
import type { ContactId } from '../../domain/contact/ContactId'
import { contactIdEquals } from '../../domain/contact/ContactId'
import type ContactCollection from '../../domain/contact/collections/ContactCollection'
import { createContactCollection } from '../../domain/contact/collections/ContactCollection'
import type { StorageService } from '../storage/StorageService'
import type { CollectionSerializer } from '../storage/Serializer'

const STORAGE_KEY = 'contacts'

export class LocalStorageContactRepository implements ContactRepository {
  private readonly storage: StorageService
  private readonly serializer: CollectionSerializer<Contact>

  constructor(
    storage: StorageService,
    serializer: CollectionSerializer<Contact>
  ) {
    this.storage = storage
    this.serializer = serializer
  }

  async save(contact: Contact): Promise<void> {
    const contacts = await this.loadContacts()
    const updated = this.upsertContact(contacts, contact)
    this.persistContacts(updated)
  }

  async findById(id: ContactId): Promise<Contact | null> {
    const contacts = await this.loadContacts()
    return contacts.find((c) => contactIdEquals(c.id, id)) ?? null
  }

  async findAll(): Promise<ContactCollection> {
    const contacts = await this.loadContacts()
    return createContactCollection(contacts)
  }

  async delete(id: ContactId): Promise<void> {
    const contacts = await this.loadContacts()
    const filtered = contacts.filter((c) => !contactIdEquals(c.id, id))
    this.persistContacts(filtered)
  }

  async search(query: string): Promise<ContactCollection> {
    const contacts = await this.loadContacts()
    const matches = contacts.filter((c) => this.matchesQuery(c, query))
    return createContactCollection(matches)
  }

  private async loadContacts(): Promise<Contact[]> {
    const data = this.storage.getItem(STORAGE_KEY)
    return data ? this.serializer.deserializeCollection(data) : []
  }

  private persistContacts(contacts: Contact[]): void {
    const serialized = this.serializer.serializeCollection(contacts)
    this.storage.setItem(STORAGE_KEY, serialized)
  }

  private upsertContact(contacts: Contact[], contact: Contact): Contact[] {
    const filtered = contacts.filter((c) => !contactIdEquals(c.id, contact.id))
    return [...filtered, contact]
  }

  private matchesQuery(contact: Contact, query: string): boolean {
    const lowerQuery = query.toLowerCase()
    return (
      contact.name.toLowerCase().includes(lowerQuery) ||
      contact.email.toLowerCase().includes(lowerQuery) ||
      contact.phone.toLowerCase().includes(lowerQuery)
    )
  }
}
