import type {
  CheckIn,
  CheckInId,
  CheckInRepository,
} from '../../domain/checkin'
import {
  createCheckIn,
  createCheckInId,
  createCheckInNotes,
  createNullCheckInNotes,
  createScheduledDate,
  createCompletionDate,
} from '../../domain/checkin'
import type { ContactRepository, ContactId } from '../../domain/contact'
import type {
  CategoryRepository,
  CategoryId,
  CheckInFrequency,
} from '../../domain/category'
import { calculateNextCheckIn } from '../../domain/services/DateCalculator'

export interface CompleteCheckInInput {
  checkInId: CheckInId
  completionDate: Date
  notes?: string
}

export interface CompleteCheckInResult {
  completedCheckIn: CheckIn
  nextCheckIn: CheckIn
}

export class CompleteCheckIn {
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

  async execute(input: CompleteCheckInInput): Promise<CompleteCheckInResult> {
    const checkIn = await this.findCheckIn(input.checkInId)
    const contact = await this.findContact(checkIn.contactId)
    const category = await this.findCategory(contact.categoryId)
    const completed = this.createCompleted(checkIn, input)
    const next = this.createNext(checkIn, category.frequency)
    await this.saveCheckIns(completed, next)
    return { completedCheckIn: completed, nextCheckIn: next }
  }

  private async findCheckIn(checkInId: CheckInId): Promise<CheckIn> {
    const checkIn = await this.checkInRepository.findById(checkInId)
    if (!checkIn) {
      throw new Error('Check-in not found')
    }
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

  private createCompleted(checkIn: CheckIn, input: CompleteCheckInInput) {
    return createCheckIn({
      id: checkIn.id,
      contactId: checkIn.contactId,
      scheduledDate: checkIn.scheduledDate,
      completionDate: createCompletionDate(input.completionDate),
      notes: this.getNotes(input),
    })
  }

  private getNotes(input: CompleteCheckInInput) {
    if (!input.notes) {
      return createNullCheckInNotes()
    }
    return createCheckInNotes(input.notes)
  }

  private createNext(checkIn: CheckIn, frequency: CheckInFrequency) {
    const nextDate = calculateNextCheckIn(checkIn.scheduledDate, frequency)
    const scheduledDate = createScheduledDate(nextDate)
    return createCheckIn({
      id: createCheckInId(),
      contactId: checkIn.contactId,
      scheduledDate,
    })
  }

  private async saveCheckIns(completed: CheckIn, next: CheckIn) {
    await this.checkInRepository.save(completed)
    await this.checkInRepository.save(next)
  }
}
