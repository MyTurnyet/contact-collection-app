import {
  type Contact,
  type ContactRepository,
  createContact,
  createContactId,
  createPhoneNumber,
  createNullPhoneNumber,
  createEmailAddress,
  createNullEmailAddress,
  createLocation,
  createNullLocation,
  createRelationshipContext,
  createNullRelationshipContext,
  createImportantDateCollection,
} from '../../domain/contact'

export interface CreateContactInput {
  name: string
  phone?: string
  email?: string
  location?: string
  country?: string
  timezone?: string
  relationshipContext?: string
}

export class CreateContact {
  private readonly repository: ContactRepository

  constructor(repository: ContactRepository) {
    this.repository = repository
  }

  async execute(input: CreateContactInput): Promise<Contact> {
    const contact = this.buildContact(input)
    await this.repository.save(contact)
    return contact
  }

  private buildContact(input: CreateContactInput): Contact {
    const contactInput = this.buildContactInput(input)
    return createContact(contactInput)
  }

  private buildContactInput(input: CreateContactInput) {
    return {
      id: createContactId(),
      name: input.name,
      ...this.buildContactFields(input),
      importantDates: createImportantDateCollection([]),
    }
  }

  private buildContactFields(input: CreateContactInput) {
    return {
      phone: this.buildPhone(input),
      email: this.buildEmail(input),
      location: this.buildLocation(input),
      relationshipContext: this.buildRelationshipContext(input),
    }
  }

  private buildPhone(input: CreateContactInput) {
    if (!input.phone) {
      return createNullPhoneNumber()
    }
    return createPhoneNumber(input.phone)
  }

  private buildEmail(input: CreateContactInput) {
    if (!input.email) {
      return createNullEmailAddress()
    }
    return createEmailAddress(input.email)
  }

  private buildLocation(input: CreateContactInput) {
    if (!input.location || !input.timezone || !input.country) {
      return createNullLocation()
    }
    return createLocation({
      city: input.location,
      country: input.country,
      timezone: input.timezone,
    })
  }

  private buildRelationshipContext(input: CreateContactInput) {
    if (!input.relationshipContext) {
      return createNullRelationshipContext()
    }
    return createRelationshipContext(input.relationshipContext)
  }
}
