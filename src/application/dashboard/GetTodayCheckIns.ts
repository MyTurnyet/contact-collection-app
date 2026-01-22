import type { CheckInRepository } from '../../domain/checkin/CheckInRepository';
import type CheckInCollection from '../../domain/checkin/collections/CheckInCollection';
import { CheckInStatus } from '../../domain/checkin/CheckInStatus';
import type { CheckIn } from '../../domain/checkin/CheckIn';
import { createCheckInCollection } from '../../domain/checkin/collections/CheckInCollection';

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
    return this.isSameDay(checkIn.scheduledDate, today);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return this.getStartOfDay(date1) === this.getStartOfDay(date2);
  }

  private getStartOfDay(date: Date): number {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    return day.getTime();
  }
}
