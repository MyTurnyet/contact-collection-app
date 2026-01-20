import {
  type Contact,
  type ContactId,
  type ContactRepository,
  createNullContact,
} from '../../domain/contact'

export class GetContactById {
  private readonly repository: ContactRepository

  constructor(repository: ContactRepository) {
    this.repository = repository
  }

  async execute(id: ContactId): Promise<Contact> {
    const contact = await this.repository.findById(id)
    return this.convertNullToNullObject(contact)
  }

  private convertNullToNullObject(contact: Contact | null): Contact {
    return contact ?? createNullContact()
  }
}
