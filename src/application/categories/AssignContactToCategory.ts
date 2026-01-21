import {
  type Contact,
  type ContactId,
  type ContactRepository,
  createContact,
} from '../../domain/contact'
import { type CategoryId, type CategoryRepository } from '../../domain/category'
import { getEntityOrThrow } from '../shared/RepositoryHelpers'

export interface AssignContactToCategoryInput {
  contactId: ContactId
  categoryId: CategoryId
}

export class AssignContactToCategory {
  private readonly contactRepository: ContactRepository
  private readonly categoryRepository: CategoryRepository

  constructor(
    contactRepository: ContactRepository,
    categoryRepository: CategoryRepository
  ) {
    this.contactRepository = contactRepository
    this.categoryRepository = categoryRepository
  }

  async execute(input: AssignContactToCategoryInput): Promise<Contact> {
    const contact = await getEntityOrThrow(
      this.contactRepository,
      input.contactId,
      'Contact'
    )
    await getEntityOrThrow(this.categoryRepository, input.categoryId, 'Category')
    const updatedContact = this.buildUpdatedContact(contact, input.categoryId)
    await this.contactRepository.save(updatedContact)
    return updatedContact
  }

  private buildUpdatedContact(
    contact: Contact,
    categoryId: CategoryId
  ): Contact {
    return createContact({
      ...this.extractContactData(contact),
      categoryId: categoryId,
    })
  }

  private extractContactData(contact: Contact) {
    return {
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      location: contact.location,
      relationshipContext: contact.relationshipContext,
      importantDates: contact.importantDates,
    }
  }
}
