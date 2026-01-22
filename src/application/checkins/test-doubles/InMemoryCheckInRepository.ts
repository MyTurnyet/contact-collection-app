import {
  type CheckIn,
  type CheckInId,
  type CheckInRepository,
  type CheckInCollection,
  createCheckInCollection,
  CheckInStatus,
  type ContactId,
} from '../../../domain/checkin'
import { BaseInMemoryRepository } from '../../test-doubles/BaseInMemoryRepository'

export class InMemoryCheckInRepository
  extends BaseInMemoryRepository<CheckIn, CheckInId, CheckInCollection>
  implements CheckInRepository
{
  protected extractId(entity: CheckIn): string {
    return entity.id
  }

  protected createCollection(entities: CheckIn[]): CheckInCollection {
    return createCheckInCollection(entities)
  }

  async findByContactId(contactId: ContactId): Promise<CheckInCollection> {
    const matches = Array.from(this.entities.values()).filter(
      (checkIn) => checkIn.contactId === contactId
    )
    return createCheckInCollection(matches)
  }

  async findByStatus(status: CheckInStatus): Promise<CheckInCollection> {
    const matches = Array.from(this.entities.values()).filter(
      (checkIn) => checkIn.status === status
    )
    return createCheckInCollection(matches)
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<CheckInCollection> {
    const matches = Array.from(this.entities.values()).filter(
      (checkIn) =>
        checkIn.scheduledDate >= startDate && checkIn.scheduledDate <= endDate
    )
    return createCheckInCollection(matches)
  }
}
