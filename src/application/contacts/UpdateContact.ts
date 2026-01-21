import {
  type Contact,
  type ContactRepository,
  type ContactId,
  createContact,
  createPhoneNumber,
  createEmailAddress,
  createLocation,
  createRelationshipContext,
} from '../../domain/contact'
import { getEntityOrThrow } from '../shared/RepositoryHelpers'

export interface UpdateContactInput {
  id: ContactId
  name?: string
  phone?: string
  email?: string
  location?: string
  country?: string
  timezone?: string
  relationshipContext?: string
}

export class UpdateContact {
  private readonly repository: ContactRepository

  constructor(repository: ContactRepository) {
    this.repository = repository
  }

  async execute(input: UpdateContactInput): Promise<Contact> {
    const existing = await getEntityOrThrow(this.repository, input.id, 'Contact')
    const updated = this.buildUpdatedContact(existing, input)
    await this.repository.save(updated)
    return updated
  }

  private buildUpdatedContact(
    existing: Contact,
    input: UpdateContactInput
  ): Contact {
    return createContact({
      id: existing.id,
      name: input.name ?? existing.name,
      phone: this.updatePhone(existing, input),
      email: this.updateEmail(existing, input),
      location: this.updateLocation(existing, input),
      relationshipContext: this.updateRelationshipContext(existing, input),
      importantDates: existing.importantDates,
    })
  }

  private updatePhone(existing: Contact, input: UpdateContactInput) {
    if (input.phone !== undefined) {
      return createPhoneNumber(input.phone)
    }
    return existing.phone
  }

  private updateEmail(existing: Contact, input: UpdateContactInput) {
    if (input.email !== undefined) {
      return createEmailAddress(input.email)
    }
    return existing.email
  }

  private updateLocation(existing: Contact, input: UpdateContactInput) {
    const hasLocationData = input.location && input.country && input.timezone
    if (hasLocationData) {
      return createLocation({
        city: input.location!,
        country: input.country!,
        timezone: input.timezone!,
      })
    }
    return existing.location
  }

  private updateRelationshipContext(
    existing: Contact,
    input: UpdateContactInput
  ) {
    if (input.relationshipContext !== undefined) {
      return createRelationshipContext(input.relationshipContext)
    }
    return existing.relationshipContext
  }
}
