import type { CheckInId, CheckInRepository } from '../../domain/checkin'
import { EntityNotFoundError } from '../shared/errors/EntityNotFoundError'

export class DeleteCheckIn {
  private readonly checkInRepository: CheckInRepository

  constructor(checkInRepository: CheckInRepository) {
    this.checkInRepository = checkInRepository
  }

  async execute(checkInId: CheckInId): Promise<void> {
    const checkIn = await this.checkInRepository.findById(checkInId)
    if (!checkIn) {
      throw new EntityNotFoundError('CheckIn', checkInId)
    }
    await this.checkInRepository.delete(checkInId)
  }
}
