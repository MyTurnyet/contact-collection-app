import type {
  CheckInRepository,
  CheckInCollection,
} from '../../domain/checkin'
import { createCheckInCollection, isScheduled } from '../../domain/checkin'
import { addDays } from 'date-fns'
import { createDateRange } from '../../domain/shared'

export interface GetUpcomingCheckInsInput {
  days?: number
}

export class GetUpcomingCheckIns {
  private readonly repository: CheckInRepository

  constructor(repository: CheckInRepository) {
    this.repository = repository
  }

  async execute(input: GetUpcomingCheckInsInput): Promise<CheckInCollection> {
    const days = this.getDays(input)
    const dateRange = this.calculateDateRange(days)
    const allCheckIns = await this.fetchCheckIns(dateRange)
    return this.filterScheduled(allCheckIns)
  }

  private getDays(input: GetUpcomingCheckInsInput): number {
    return input.days ?? 7
  }

  private calculateDateRange(days: number) {
    const startDate = new Date()
    const endDate = addDays(startDate, days)
    return createDateRange(startDate, endDate)
  }

  private async fetchCheckIns(dateRange: ReturnType<typeof createDateRange>) {
    return this.repository.findByDateRange(dateRange)
  }

  private filterScheduled(checkIns: CheckInCollection) {
    const scheduled = checkIns.toArray().filter(isScheduled)
    return createCheckInCollection(scheduled)
  }
}
