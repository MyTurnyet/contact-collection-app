import type {
  CheckInRepository,
  CheckInCollection,
} from '../../domain/checkin'
import { CheckInStatus } from '../../domain/checkin'

export class GetOverdueCheckIns {
  private readonly repository: CheckInRepository

  constructor(repository: CheckInRepository) {
    this.repository = repository
  }

  async execute(): Promise<CheckInCollection> {
    return this.repository.findByStatus(CheckInStatus.Overdue)
  }
}
