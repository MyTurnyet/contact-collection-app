import {
  type Contact,
  type ContactRepository,
  createContact,
  createContactId,
  createContactName,
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
  timezone?: string
  relationshipContext?: string
}

export class CreateContact {
  constructor(private readonly repository: ContactRepository) {}

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
    if (!input.location || !input.timezone) {
      return undefined
    }
    return createLocation({
      city: input.location,
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
