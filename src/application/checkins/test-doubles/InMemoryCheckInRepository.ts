import type {
  CheckIn,
  CheckInId,
  CheckInRepository,
  CheckInCollection,
} from '../../../domain/checkin'
import { createCheckInCollection, CheckInStatus } from '../../../domain/checkin'
import type { ContactId } from '../../../domain/contact'
import { BaseInMemoryRepository } from '../../test-doubles/BaseInMemoryRepository'
import { type DateRange, isDateInRange } from '../../../domain/shared'

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

  async findByDateRange(range: DateRange): Promise<CheckInCollection> {
    const matches = Array.from(this.entities.values()).filter((checkIn) =>
      isDateInRange(checkIn.scheduledDate, range)
    )
    return createCheckInCollection(matches)
  }
}
