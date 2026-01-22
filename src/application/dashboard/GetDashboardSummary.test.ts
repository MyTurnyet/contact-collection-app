import { describe, it, expect, beforeEach } from 'vitest';
import { GetDashboardSummary } from './GetDashboardSummary';
import { InMemoryContactRepository } from '../contacts/test-doubles/InMemoryContactRepository';
import { InMemoryCheckInRepository } from '../checkins/test-doubles/InMemoryCheckInRepository';
import { type Contact, createContact } from '../../domain/contact/Contact';
import { type ContactId, createContactId } from '../../domain/contact/ContactId';
import { createPhoneNumber } from '../../domain/contact/PhoneNumber';
import { createEmailAddress } from '../../domain/contact/EmailAddress';
import { createRelationshipContext } from '../../domain/contact/RelationshipContext';
import { type CategoryId, createCategoryId } from '../../domain/category/CategoryId';
import { type CheckIn, createCheckIn } from '../../domain/checkin/CheckIn';
import { createCheckInId } from '../../domain/checkin/CheckInId';
import { createScheduledDate } from '../../domain/checkin/ScheduledDate';
import { createCompletionDate } from '../../domain/checkin/CompletionDate';
import { createCheckInNotes } from '../../domain/checkin/CheckInNotes';

describe('GetDashboardSummary', () => {
  let contactRepository: InMemoryContactRepository;
  let checkInRepository: InMemoryCheckInRepository;
  let useCase: GetDashboardSummary;
  let today: Date;

  beforeEach(() => {
    contactRepository = new InMemoryContactRepository();
    checkInRepository = new InMemoryCheckInRepository();
    useCase = new GetDashboardSummary(
      contactRepository,
      checkInRepository
    );
    today = new Date();
  });

  describe('when there are no contacts and no check-ins', () => {
    it('returns zero counts', async () => {
      const summary = await useCase.execute();

      expect(summary.overdueCount).toBe(0);
      expect(summary.upcomingCount).toBe(0);
      expect(summary.totalContacts).toBe(0);
      expect(summary.contactsByCategory.size).toBe(0);
    });
  });

  describe('when there are contacts', () => {
    it('returns total contact count', async () => {
      const contact1 = buildContact('Alice', 'alice@example.com');
      const contact2 = buildContact('Bob', 'bob@example.com');

      await contactRepository.save(contact1);
      await contactRepository.save(contact2);

      const summary = await useCase.execute();

      expect(summary.totalContacts).toBe(2);
    });

    it('groups contacts by category', async () => {
      const categoryIdFamily = createCategoryId();
      const categoryIdFriends = createCategoryId();

      const contact1 = buildContactWithCategory(
        'Alice',
        'alice@example.com',
        categoryIdFamily
      );
      const contact2 = buildContactWithCategory(
        'Bob',
        'bob@example.com',
        categoryIdFamily
      );
      const contact3 = buildContactWithCategory(
        'Charlie',
        'charlie@example.com',
        categoryIdFriends
      );

      await contactRepository.save(contact1);
      await contactRepository.save(contact2);
      await contactRepository.save(contact3);

      const summary = await useCase.execute();

      expect(summary.contactsByCategory.get(categoryIdFamily)).toBe(2);
      expect(summary.contactsByCategory.get(categoryIdFriends)).toBe(1);
    });

    it('handles contacts without categories', async () => {
      const contact = buildContact('Alice', 'alice@example.com');
      await contactRepository.save(contact);

      const summary = await useCase.execute();

      expect(summary.contactsByCategory.get('uncategorized')).toBe(1);
    });
  });

  describe('when there are overdue check-ins', () => {
    it('counts overdue check-ins correctly', async () => {
      const contact1 = buildContact('Alice', 'alice@example.com');
      const contact2 = buildContact('Bob', 'bob@example.com');

      await contactRepository.save(contact1);
      await contactRepository.save(contact2);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const overdueCheckIn1 = buildCheckIn(contact1.id, yesterday);
      const overdueCheckIn2 = buildCheckIn(contact2.id, twoDaysAgo);

      await checkInRepository.save(overdueCheckIn1);
      await checkInRepository.save(overdueCheckIn2);

      const summary = await useCase.execute();

      expect(summary.overdueCount).toBe(2);
    });

    it('does not count completed check-ins as overdue', async () => {
      const contact = buildContact('Alice', 'alice@example.com');
      await contactRepository.save(contact);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const completedCheckIn = buildCompletedCheckIn(contact.id, yesterday, today, 'Had a great call!');

      await checkInRepository.save(completedCheckIn);

      const summary = await useCase.execute();

      expect(summary.overdueCount).toBe(0);
    });
  });

  describe('when there are upcoming check-ins', () => {
    it('counts check-ins in the next 7 days', async () => {
      const contact1 = buildContact('Alice', 'alice@example.com');
      const contact2 = buildContact('Bob', 'bob@example.com');

      await contactRepository.save(contact1);
      await contactRepository.save(contact2);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const inFiveDays = new Date(today);
      inFiveDays.setDate(inFiveDays.getDate() + 5);

      const upcomingCheckIn1 = buildCheckIn(contact1.id, tomorrow);
      const upcomingCheckIn2 = buildCheckIn(contact2.id, inFiveDays);

      await checkInRepository.save(upcomingCheckIn1);
      await checkInRepository.save(upcomingCheckIn2);

      const summary = await useCase.execute();

      expect(summary.upcomingCount).toBe(2);
    });

    it('does not count check-ins beyond 7 days', async () => {
      const contact = buildContact('Alice', 'alice@example.com');
      await contactRepository.save(contact);

      const inEightDays = new Date(today);
      inEightDays.setDate(inEightDays.getDate() + 8);

      const futureCheckIn = buildCheckIn(contact.id, inEightDays);
      await checkInRepository.save(futureCheckIn);

      const summary = await useCase.execute();

      expect(summary.upcomingCount).toBe(0);
    });

    it('includes today in upcoming count', async () => {
      const contact = buildContact('Alice', 'alice@example.com');
      await contactRepository.save(contact);

      const checkIn = buildCheckIn(contact.id, today);
      await checkInRepository.save(checkIn);

      const summary = await useCase.execute();

      expect(summary.upcomingCount).toBe(1);
    });

    it('does not count completed check-ins as upcoming', async () => {
      const contact = buildContact('Alice', 'alice@example.com');
      await contactRepository.save(contact);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const completedCheckIn = buildCompletedCheckIn(contact.id, tomorrow, today, 'Already done');

      await checkInRepository.save(completedCheckIn);

      const summary = await useCase.execute();

      expect(summary.upcomingCount).toBe(0);
    });
  });

  describe('comprehensive scenario', () => {
    it('calculates all metrics correctly', async () => {
      const categoryIdFamily = createCategoryId();
      const categoryIdFriends = createCategoryId();

      // Create contacts
      const contact1 = buildContactWithCategory('Alice', 'alice@example.com', categoryIdFamily);
      const contact2 = buildContactWithCategory('Bob', 'bob@example.com', categoryIdFamily);
      const contact3 = buildContactWithCategory('Charlie', 'charlie@example.com', categoryIdFriends);
      const contact4 = buildContact('Dave', 'dave@example.com');

      await contactRepository.save(contact1);
      await contactRepository.save(contact2);
      await contactRepository.save(contact3);
      await contactRepository.save(contact4);

      // Create check-ins
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const inThreeDays = new Date(today);
      inThreeDays.setDate(inThreeDays.getDate() + 3);

      const overdueCheckIn = buildCheckIn(contact1.id, yesterday);
      const upcomingCheckIn1 = buildCheckIn(contact2.id, tomorrow);
      const upcomingCheckIn2 = buildCheckIn(contact3.id, inThreeDays);

      await checkInRepository.save(overdueCheckIn);
      await checkInRepository.save(upcomingCheckIn1);
      await checkInRepository.save(upcomingCheckIn2);

      const summary = await useCase.execute();

      expect(summary.totalContacts).toBe(4);
      expect(summary.overdueCount).toBe(1);
      expect(summary.upcomingCount).toBe(2);
      expect(summary.contactsByCategory.get(categoryIdFamily)).toBe(2);
      expect(summary.contactsByCategory.get(categoryIdFriends)).toBe(1);
      expect(summary.contactsByCategory.get('uncategorized')).toBe(1);
    });
  });
});

function buildContact(name: string, email: string): Contact {
  return createContact({
    id: createContactId(),
    name,
    phone: createPhoneNumber('555-123-4567'),
    email: createEmailAddress(email),
    relationshipContext: createRelationshipContext('Friend')
  });
}

function buildContactWithCategory(
  name: string,
  email: string,
  categoryId: CategoryId
): Contact {
  return createContact({
    id: createContactId(),
    name,
    phone: createPhoneNumber('555-123-4567'),
    email: createEmailAddress(email),
    relationshipContext: createRelationshipContext('Friend'),
    categoryId
  });
}

function buildCheckIn(contactId: ContactId, scheduledDate: Date): CheckIn {
  return createCheckIn({
    id: createCheckInId(),
    contactId,
    scheduledDate: createScheduledDate(scheduledDate)
  });
}

function buildCompletedCheckIn(
  contactId: ContactId,
  scheduledDate: Date,
  completionDate: Date,
  notes: string
): CheckIn {
  return createCheckIn({
    id: createCheckInId(),
    contactId,
    scheduledDate: createScheduledDate(scheduledDate),
    completionDate: createCompletionDate(completionDate),
    notes: createCheckInNotes(notes)
  });
}
