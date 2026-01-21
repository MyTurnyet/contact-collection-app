import {
  type Contact,
  type ContactId,
  type ContactRepository,
  type ContactCollection,
  createContactCollection,
} from '../../../domain/contact'
import { BaseInMemoryRepository } from '../../test-doubles/BaseInMemoryRepository'

export class InMemoryContactRepository
  extends BaseInMemoryRepository<Contact, ContactId, ContactCollection>
  implements ContactRepository
{
  protected extractId(entity: Contact): string {
    return entity.id
  }

  protected createCollection(entities: Contact[]): ContactCollection {
    return createContactCollection(entities)
  }

  async search(query: string): Promise<ContactCollection> {
    const lowerQuery = query.toLowerCase()
    const matches = Array.from(this.entities.values()).filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowerQuery) ||
        (contact.email?.toLowerCase().includes(lowerQuery) ?? false)
    )
    return createContactCollection(matches)
  }
}
