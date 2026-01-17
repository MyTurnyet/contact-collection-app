import {
  type Contact,
  type ContactRepository,
  createContact,
  createContactId,
  createPhoneNumber,
  createEmailAddress,
  createLocation,
  createRelationshipContext,
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
    return createContact({
      id: createContactId(),
      name: input.name,
      phone: input.phone ? createPhoneNumber(input.phone) : undefined,
      email: input.email ? createEmailAddress(input.email) : undefined,
      location: this.buildLocation(input),
      relationshipContext: this.buildRelationshipContext(input),
      importantDates: createImportantDateCollection([]),
    })
  }

  private buildLocation(input: CreateContactInput) {
    if (!input.location || !input.timezone || !input.country) {
      return undefined
    }
    return createLocation({
      city: input.location,
      country: input.country,
      timezone: input.timezone,
    })
  }

  private buildRelationshipContext(input: CreateContactInput) {
    if (!input.relationshipContext) {
      return undefined
    }
    return createRelationshipContext(input.relationshipContext)
  }
}
