import type {
  CheckIn,
  CheckInId,
  CheckInRepository,
} from '../../domain/checkin'
import { createCheckIn, createScheduledDate } from '../../domain/checkin'

export interface RescheduleCheckInInput {
  checkInId: CheckInId
  newScheduledDate: Date
}

export class RescheduleCheckIn {
  private readonly repository: CheckInRepository

  constructor(repository: CheckInRepository) {
    this.repository = repository
  }

  async execute(input: RescheduleCheckInInput): Promise<CheckIn> {
    const checkIn = await this.findCheckIn(input.checkInId)
    const rescheduled = this.createRescheduled(checkIn, input)
    await this.repository.save(rescheduled)
    return rescheduled
  }

  private async findCheckIn(checkInId: CheckInId): Promise<CheckIn> {
    const checkIn = await this.repository.findById(checkInId)
    if (!checkIn) {
      throw new Error('Check-in not found')
    }
    return checkIn
  }

  private createRescheduled(checkIn: CheckIn, input: RescheduleCheckInInput) {
    const scheduledDate = createScheduledDate(input.newScheduledDate)
    return createCheckIn({
      id: checkIn.id,
      contactId: checkIn.contactId,
      scheduledDate,
      completionDate: checkIn.completionDate,
      notes: checkIn.notes,
    })
  }
}
