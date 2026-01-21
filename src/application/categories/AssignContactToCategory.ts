import {
  type Contact,
  type ContactId,
  type ContactRepository,
  createContact,
} from '../../domain/contact'
import { type CategoryId, type CategoryRepository } from '../../domain/category'

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
    const contact = await this.getExistingContact(input.contactId)
    await this.verifyCategoryExists(input.categoryId)
    const updatedContact = this.buildUpdatedContact(contact, input.categoryId)
    await this.contactRepository.save(updatedContact)
    return updatedContact
  }

  private async getExistingContact(id: ContactId): Promise<Contact> {
    const contact = await this.contactRepository.findById(id)
    if (!contact) {
      throw new Error('Contact not found')
    }
    return contact
  }

  private async verifyCategoryExists(id: CategoryId): Promise<void> {
    const category = await this.categoryRepository.findById(id)
    if (!category) {
      throw new Error('Category not found')
    }
  }

  private buildUpdatedContact(
    contact: Contact,
    categoryId: CategoryId
  ): Contact {
    return createContact({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      location: contact.location,
      relationshipContext: contact.relationshipContext,
      categoryId: categoryId,
      importantDates: contact.importantDates,
    })
  }
}
