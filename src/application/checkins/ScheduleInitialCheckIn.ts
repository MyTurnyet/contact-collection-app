import {
  type CheckIn,
  type CheckInRepository,
  createCheckIn,
  createCheckInId,
} from '../../domain/checkin'
import { type ContactId, type ContactRepository } from '../../domain/contact'
import {
  type CategoryRepository,
  type CategoryId,
  type CheckInFrequency,
} from '../../domain/category'
import { calculateNextCheckIn } from '../../domain/services/DateCalculator'

export interface ScheduleInitialCheckInInput {
  contactId: ContactId
  baseDate?: Date
}

export class ScheduleInitialCheckIn {
  constructor(
    private readonly checkInRepository: CheckInRepository,
    private readonly contactRepository: ContactRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(input: ScheduleInitialCheckInInput): Promise<CheckIn> {
    const contact = await this.findContact(input.contactId)
    const category = await this.findCategory(contact.categoryId)
    const baseDate = this.getBaseDate(input)
    const checkIn = this.createCheckIn(input, baseDate, category.frequency)
    await this.checkInRepository.save(checkIn)
    return checkIn
  }

  private async findContact(contactId: ContactId) {
    const contact = await this.contactRepository.findById(contactId)
    if (!contact) {
      throw new Error('Contact not found')
    }
    return contact
  }

  private async findCategory(categoryId: CategoryId) {
    const category = await this.categoryRepository.findById(categoryId)
    if (!category) {
      throw new Error('Category not found')
    }
    return category
  }

  private getBaseDate(input: ScheduleInitialCheckInInput): Date {
    return input.baseDate ?? new Date()
  }

  private createCheckIn(
    input: ScheduleInitialCheckInInput,
    baseDate: Date,
    frequency: CheckInFrequency
  ) {
    const scheduledDate = calculateNextCheckIn(baseDate, frequency)
    return createCheckIn({
      id: createCheckInId(),
      contactId: input.contactId,
      scheduledDate,
    })
  }
}
