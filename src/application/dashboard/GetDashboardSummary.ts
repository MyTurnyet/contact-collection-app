import type { ContactRepository } from '../../domain/contact/ContactRepository';
import type { CheckInRepository } from '../../domain/checkin/CheckInRepository';
import type { DashboardSummary } from './DashboardSummary';
import type { CheckIn } from '../../domain/checkin/CheckIn';
import type ContactCollection from '../../domain/contact/collections/ContactCollection';
import type CheckInCollection from '../../domain/checkin/collections/CheckInCollection';
import type { Contact } from '../../domain/contact/Contact';
import { isNullCategoryId } from '../../domain/category/CategoryId';
import { addDaysToDate, isOverdue as isDateOverdue } from '../../domain/services';
import { isNotCompleted } from '../../domain/checkin';
import { createDateRange, isDateInRange } from '../../domain/shared';

export class GetDashboardSummary {
  private readonly contactRepository: ContactRepository
  private readonly checkInRepository: CheckInRepository

  constructor(
    contactRepository: ContactRepository,
    checkInRepository: CheckInRepository
  ) {
    this.contactRepository = contactRepository
    this.checkInRepository = checkInRepository
  }

  async execute(): Promise<DashboardSummary> {
    const contacts = await this.contactRepository.findAll();
    const checkIns = await this.checkInRepository.findAll();
    const today = new Date();

    return {
      totalContacts: contacts.size,
      overdueCount: this.countOverdue(checkIns, today),
      upcomingCount: this.countUpcoming(checkIns, today),
      contactsByCategory: this.groupContactsByCategory(contacts),
    };
  }

  private countOverdue(checkIns: CheckInCollection, today: Date): number {
    const overdue = checkIns
      .toArray()
      .filter((checkIn: CheckIn) => this.isOverdue(checkIn, today));
    return overdue.length;
  }

  private isOverdue(checkIn: CheckIn, today: Date): boolean {
    if (!isNotCompleted(checkIn)) {
      return false;
    }
    return isDateOverdue(checkIn.scheduledDate, today);
  }

  private countUpcoming(checkIns: CheckInCollection, today: Date): number {
    const sevenDaysFromNow = addDaysToDate(today, 7);
    const upcomingRange = createDateRange(today, sevenDaysFromNow);
    const upcoming = checkIns
      .toArray()
      .filter((checkIn: CheckIn) => this.isUpcoming(checkIn, upcomingRange));
    return upcoming.length;
  }

  private isUpcoming(
    checkIn: CheckIn,
    range: ReturnType<typeof createDateRange>
  ): boolean {
    if (!isNotCompleted(checkIn)) {
      return false;
    }
    return isDateInRange(checkIn.scheduledDate, range);
  }

  private groupContactsByCategory(
    contacts: ContactCollection
  ): Map<string, number> {
    const categoryMap = new Map<string, number>();

    for (const contact of contacts.toArray()) {
      const categoryKey = this.getCategoryKey(contact);
      const currentCount = categoryMap.get(categoryKey) || 0;
      categoryMap.set(categoryKey, currentCount + 1);
    }

    return categoryMap;
  }

  private getCategoryKey(contact: Contact): string {
    if (isNullCategoryId(contact.categoryId)) {
      return 'uncategorized';
    }
    return contact.categoryId;
  }
}
