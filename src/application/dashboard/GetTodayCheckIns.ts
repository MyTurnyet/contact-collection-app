import type { CheckInRepository } from '../../domain/checkin/CheckInRepository';
import type CheckInCollection from '../../domain/checkin/collections/CheckInCollection';
import { CheckInStatus } from '../../domain/checkin/CheckInStatus';
import type { CheckIn } from '../../domain/checkin/CheckIn';
import { createCheckInCollection } from '../../domain/checkin/collections/CheckInCollection';
import { areSameDay } from '../../domain/services';

export class GetTodayCheckIns {
  private readonly checkInRepository: CheckInRepository

  constructor(
    checkInRepository: CheckInRepository
  ) {
    this.checkInRepository = checkInRepository
  }

  async execute(): Promise<CheckInCollection> {
    const checkIns = await this.checkInRepository.findAll();
    const today = new Date();

    const todayCheckIns = checkIns
      .toArray()
      .filter((checkIn: CheckIn) => this.isScheduledForToday(checkIn, today));

    return createCheckInCollection(todayCheckIns);
  }

  private isScheduledForToday(checkIn: CheckIn, today: Date): boolean {
    if (checkIn.status === CheckInStatus.Completed) {
      return false;
    }
    return areSameDay(checkIn.scheduledDate, today);
  }
}
