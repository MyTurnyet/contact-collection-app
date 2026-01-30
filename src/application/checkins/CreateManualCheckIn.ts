import type {
  CheckIn,
  CheckInRepository,
} from '../../domain/checkin'
import {
  createCheckIn,
  createCheckInId,
  createScheduledDate,
  createCheckInNotes,
  createNullCheckInNotes,
} from '../../domain/checkin'
import type { ContactId, ContactRepository } from '../../domain/contact'

export interface CreateManualCheckInInput {
  contactId: ContactId
  scheduledDate: Date
  notes?: string
}

export class CreateManualCheckIn {
  private readonly checkInRepository: CheckInRepository
  private readonly contactRepository: ContactRepository

  constructor(
    checkInRepository: CheckInRepository,
    contactRepository: ContactRepository
  ) {
    this.checkInRepository = checkInRepository
    this.contactRepository = contactRepository
  }

  async execute(input: CreateManualCheckInInput): Promise<CheckIn> {
    await this.validateContact(input.contactId)
    const checkIn = this.createCheckIn(input)
    await this.checkInRepository.save(checkIn)
    return checkIn
  }

  private async validateContact(contactId: ContactId): Promise<void> {
    const contact = await this.contactRepository.findById(contactId)
    if (!contact) {
      throw new Error('Contact not found')
    }
  }

  private createCheckIn(input: CreateManualCheckInInput): CheckIn {
    const scheduledDate = createScheduledDate(input.scheduledDate)
    const notes = this.createNotes(input.notes)
    return createCheckIn({
      id: createCheckInId(),
      contactId: input.contactId,
      scheduledDate,
      notes,
    })
  }

  private createNotes(notesText?: string) {
    return notesText
      ? createCheckInNotes(notesText)
      : createNullCheckInNotes()
  }
}
