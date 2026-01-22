import {
  type CheckInRepository,
  type CheckInCollection,
  CheckInStatus,
} from '../../domain/checkin'

export class GetOverdueCheckIns {
  constructor(private readonly repository: CheckInRepository) {}

  async execute(): Promise<CheckInCollection> {
    return this.repository.findByStatus(CheckInStatus.Overdue)
  }
}
