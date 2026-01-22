import {
  type CheckInRepository,
  type CheckInCollection,
  CheckInStatus,
  createCheckInCollection,
} from '../../domain/checkin'
import { addDays } from 'date-fns'

export interface GetUpcomingCheckInsInput {
  days?: number
}

export class GetUpcomingCheckIns {
  constructor(private readonly repository: CheckInRepository) {}

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
    return { startDate, endDate }
  }

  private async fetchCheckIns(dateRange: {
    startDate: Date
    endDate: Date
  }) {
    return this.repository.findByDateRange(
      dateRange.startDate,
      dateRange.endDate
    )
  }

  private filterScheduled(checkIns: CheckInCollection) {
    const scheduled = checkIns
      .toArray()
      .filter((c) => c.status === CheckInStatus.Scheduled)
    return createCheckInCollection(scheduled)
  }
}
