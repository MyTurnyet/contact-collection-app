import type {
  CheckIn,
  CheckInRepository,
} from '../../domain/checkin'
import {
  createCheckIn,
  createCheckInId,
  createScheduledDate,
} from '../../domain/checkin'
import type { ContactId, ContactRepository } from '../../domain/contact'
import type {
  CategoryRepository,
  CategoryId,
  CheckInFrequency,
} from '../../domain/category'
import { calculateNextCheckIn } from '../../domain/services/DateCalculator'

export interface ScheduleInitialCheckInInput {
  contactId: ContactId
  baseDate?: Date
}

export class ScheduleInitialCheckIn {
  private readonly checkInRepository: CheckInRepository
  private readonly contactRepository: ContactRepository
  private readonly categoryRepository: CategoryRepository

  constructor(
    checkInRepository: CheckInRepository,
    contactRepository: ContactRepository,
    categoryRepository: CategoryRepository
  ) {
    this.checkInRepository = checkInRepository
    this.contactRepository = contactRepository
    this.categoryRepository = categoryRepository
  }

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
    const nextDate = calculateNextCheckIn(baseDate, frequency)
    const scheduledDate = createScheduledDate(nextDate)
    return createCheckIn({
      id: createCheckInId(),
      contactId: input.contactId,
      scheduledDate,
    })
  }
}
