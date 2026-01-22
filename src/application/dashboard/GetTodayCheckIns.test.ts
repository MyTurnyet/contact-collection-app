import { describe, it, expect, beforeEach } from 'vitest';
import { GetTodayCheckIns } from './GetTodayCheckIns';
import { InMemoryCheckInRepository } from '../checkins/test-doubles/InMemoryCheckInRepository';
import { InMemoryContactRepository } from '../contacts/test-doubles/InMemoryContactRepository';
import { type Contact, createContact } from '../../domain/contact/Contact';
import { type ContactId, createContactId } from '../../domain/contact/ContactId';
import { createPhoneNumber } from '../../domain/contact/PhoneNumber';
import { createEmailAddress } from '../../domain/contact/EmailAddress';
import { createRelationshipContext } from '../../domain/contact/RelationshipContext';
import { type CheckIn, createCheckIn } from '../../domain/checkin/CheckIn';
import { createCheckInId } from '../../domain/checkin/CheckInId';
import { createScheduledDate } from '../../domain/checkin/ScheduledDate';
import { createCompletionDate } from '../../domain/checkin/CompletionDate';
import { createCheckInNotes } from '../../domain/checkin/CheckInNotes';

describe('GetTodayCheckIns', () => {
  let checkInRepository: InMemoryCheckInRepository;
  let contactRepository: InMemoryContactRepository;
  let useCase: GetTodayCheckIns;
  let today: Date;

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    contactRepository = new InMemoryContactRepository();
    useCase = new GetTodayCheckIns(checkInRepository, contactRepository);
    today = new Date();
  });

  describe('when there are no check-ins', () => {
    it('returns empty collection', async () => {
      const result = await useCase.execute();

      expect(result.size).toBe(0);
    });
  });

  describe('when there are check-ins scheduled for today', () => {
    it('returns check-ins scheduled for today', async () => {
      const contact1 = buildContact('Alice', 'alice@example.com');
      const contact2 = buildContact('Bob', 'bob@example.com');

      await contactRepository.save(contact1);
      await contactRepository.save(contact2);

      const checkIn1 = buildCheckIn(contact1.id, today);
      const checkIn2 = buildCheckIn(contact2.id, today);

      await checkInRepository.save(checkIn1);
      await checkInRepository.save(checkIn2);

      const result = await useCase.execute();

      expect(result.size).toBe(2);
      const checkIns = result.toArray();
      expect(checkIns).toContainEqual(checkIn1);
      expect(checkIns).toContainEqual(checkIn2);
    });

    it('returns check-ins with contact information', async () => {
      const contact = buildContact('Alice', 'alice@example.com');
      await contactRepository.save(contact);

      const checkIn = buildCheckIn(contact.id, today);
      await checkInRepository.save(checkIn);

      const result = await useCase.execute();

      expect(result.size).toBe(1);
      const checkIns = result.toArray();
      expect(checkIns[0].id).toEqual(checkIn.id);
      expect(checkIns[0].contactId).toEqual(contact.id);
    });
  });

  describe('when there are check-ins not scheduled for today', () => {
    it('does not return yesterday check-ins', async () => {
      const contact = buildContact('Alice', 'alice@example.com');
      await contactRepository.save(contact);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const checkIn = buildCheckIn(contact.id, yesterday);
      await checkInRepository.save(checkIn);

      const result = await useCase.execute();

      expect(result.size).toBe(0);
    });

    it('does not return tomorrow check-ins', async () => {
      const contact = buildContact('Alice', 'alice@example.com');
      await contactRepository.save(contact);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const checkIn = buildCheckIn(contact.id, tomorrow);
      await checkInRepository.save(checkIn);

      const result = await useCase.execute();

      expect(result.size).toBe(0);
    });
  });

  describe('when there are completed check-ins for today', () => {
    it('does not return completed check-ins', async () => {
      const contact = buildContact('Alice', 'alice@example.com');
      await contactRepository.save(contact);

      const completedCheckIn = buildCompletedCheckIn(
        contact.id,
        today,
        today,
        'Already done'
      );
      await checkInRepository.save(completedCheckIn);

      const result = await useCase.execute();

      expect(result.size).toBe(0);
    });

    it('returns only non-completed check-ins for today', async () => {
      const contact1 = buildContact('Alice', 'alice@example.com');
      const contact2 = buildContact('Bob', 'bob@example.com');

      await contactRepository.save(contact1);
      await contactRepository.save(contact2);

      const scheduledCheckIn = buildCheckIn(contact1.id, today);
      const completedCheckIn = buildCompletedCheckIn(
        contact2.id,
        today,
        today,
        'Done'
      );

      await checkInRepository.save(scheduledCheckIn);
      await checkInRepository.save(completedCheckIn);

      const result = await useCase.execute();

      expect(result.size).toBe(1);
      expect(result.toArray()[0].id).toEqual(scheduledCheckIn.id);
    });
  });

  describe('mixed scenarios', () => {
    it('returns only scheduled check-ins for today', async () => {
      const contact1 = buildContact('Alice', 'alice@example.com');
      const contact2 = buildContact('Bob', 'bob@example.com');
      const contact3 = buildContact('Charlie', 'charlie@example.com');

      await contactRepository.save(contact1);
      await contactRepository.save(contact2);
      await contactRepository.save(contact3);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayCheckIn = buildCheckIn(contact1.id, today);
      const yesterdayCheckIn = buildCheckIn(contact2.id, yesterday);
      const tomorrowCheckIn = buildCheckIn(contact3.id, tomorrow);

      await checkInRepository.save(todayCheckIn);
      await checkInRepository.save(yesterdayCheckIn);
      await checkInRepository.save(tomorrowCheckIn);

      const result = await useCase.execute();

      expect(result.size).toBe(1);
      expect(result.toArray()[0].id).toEqual(todayCheckIn.id);
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
