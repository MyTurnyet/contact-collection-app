import type { CheckInRepository } from '../../domain/checkin/CheckInRepository'
import type CheckInCollection from '../../domain/checkin/collections/CheckInCollection'

export class ListAllCheckIns {
  private readonly repository: CheckInRepository

  constructor(repository: CheckInRepository) {
    this.repository = repository
  }

  async execute(): Promise<CheckInCollection> {
    return this.repository.findAll()
  }
}
