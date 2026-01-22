import type {
  CheckIn,
  CheckInRepository,
  CheckInCollection,
} from '../../domain/checkin'
import { createCheckInCollection } from '../../domain/checkin'
import type { ContactId } from '../../domain/contact'

export interface GetCheckInHistoryInput {
  contactId: ContactId
}

export class GetCheckInHistory {
  private readonly repository: CheckInRepository

  constructor(repository: CheckInRepository) {
    this.repository = repository
  }

  async execute(input: GetCheckInHistoryInput): Promise<CheckInCollection> {
    const checkIns = await this.fetchCheckIns(input.contactId)
    return this.sortByScheduledDate(checkIns)
  }

  private async fetchCheckIns(contactId: ContactId) {
    return this.repository.findByContactId(contactId)
  }

  private sortByScheduledDate(checkIns: CheckInCollection) {
    const mutableArray = [...checkIns.toArray()]
    const sorted = mutableArray.sort((a, b) =>
      this.compareScheduledDates(a, b)
    )
    return createCheckInCollection(sorted)
  }

  private compareScheduledDates(a: CheckIn, b: CheckIn): number {
    return a.scheduledDate.getTime() - b.scheduledDate.getTime()
  }
}
