import { describe, it, expect, beforeEach } from 'vitest'
import { CompleteCheckIn } from '../CompleteCheckIn'
import { InMemoryCheckInRepository } from '../test-doubles/InMemoryCheckInRepository'
import { InMemoryContactRepository } from '../../contacts/test-doubles/InMemoryContactRepository'
import { InMemoryCategoryRepository } from '../../categories/test-doubles/InMemoryCategoryRepository'
import {
  createCheckIn,
  createCheckInId,
  CheckInStatus,
  isNullCheckInNotes,
  createScheduledDate,
  createCompletionDate,
  createCheckInNotes,
} from '../../../domain/checkin'
import {
  createContact,
  createContactId,
  createImportantDateCollection,
} from '../../../domain/contact'
import {
  createCategory,
  createCategoryId,
  createCategoryName,
  createCheckInFrequency,
} from '../../../domain/category'
import { addWeeks, addMonths } from 'date-fns'

describe('CompleteCheckIn', () => {
  let checkInRepository: InMemoryCheckInRepository
  let contactRepository: InMemoryContactRepository
  let categoryRepository: InMemoryCategoryRepository
  let completeCheckIn: CompleteCheckIn

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    contactRepository = new InMemoryContactRepository()
    categoryRepository = new InMemoryCategoryRepository()
    completeCheckIn = new CompleteCheckIn(
      checkInRepository,
      contactRepository,
      categoryRepository
    )
  })

  it('should mark check-in as completed with notes', async () => {
    const categoryId = createCategoryId()
    const category = createCategory({
      id: categoryId,
      name: createCategoryName('Friends'),
      frequency: createCheckInFrequency({ value: 1, unit: 'weeks' }),
    })
    await categoryRepository.save(category)

    const contactId = createContactId()
    const contact = createContact({
      id: contactId,
      name: 'John Doe',
      categoryId,
      importantDates: createImportantDateCollection([]),
    })
    await contactRepository.save(contact)

    const scheduledDate = createScheduledDate(new Date('2026-02-01'))
    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate,
    })
    await checkInRepository.save(checkIn)

    const completionDate = createCompletionDate(new Date('2026-02-02'))
    const notes = createCheckInNotes('Great conversation about vacation plans')

    const result = await completeCheckIn.execute({
      checkInId: checkIn.id,
      completionDate,
      notes,
    })

    expect(result.completedCheckIn.status).toBe(CheckInStatus.Completed)
    expect(result.completedCheckIn.completionDate).toEqual(completionDate)
    expect(result.completedCheckIn.notes).toBe(notes)
  })

  it('should schedule next check-in from original scheduled date', async () => {
    const categoryId = createCategoryId()
    const category = createCategory({
      id: categoryId,
      name: createCategoryName('Friends'),
      frequency: createCheckInFrequency({ value: 1, unit: 'weeks' }),
    })
    await categoryRepository.save(category)

    const contactId = createContactId()
    const contact = createContact({
      id: contactId,
      name: 'Jane Smith',
      categoryId,
      importantDates: createImportantDateCollection([]),
    })
    await contactRepository.save(contact)

    const scheduledDate = createScheduledDate(new Date('2026-02-01'))
    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate,
    })
    await checkInRepository.save(checkIn)

    const completionDate = createCompletionDate(new Date('2026-02-05'))
    const expectedNextDate = addWeeks(scheduledDate, 1)

    const result = await completeCheckIn.execute({
      checkInId: checkIn.id,
      completionDate,
    })

    expect(result.nextCheckIn.scheduledDate).toEqual(expectedNextDate)
    expect(result.nextCheckIn.status).toBe(CheckInStatus.Scheduled)
    expect(result.nextCheckIn.contactId).toBe(contactId)
  })

  it('should handle monthly frequency correctly', async () => {
    const categoryId = createCategoryId()
    const category = createCategory({
      id: categoryId,
      name: createCategoryName('Family'),
      frequency: createCheckInFrequency({ value: 1, unit: 'months' }),
    })
    await categoryRepository.save(category)

    const contactId = createContactId()
    const contact = createContact({
      id: contactId,
      name: 'Bob Johnson',
      categoryId,
      importantDates: createImportantDateCollection([]),
    })
    await contactRepository.save(contact)

    const scheduledDate = createScheduledDate(new Date('2026-02-15'))
    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate,
    })
    await checkInRepository.save(checkIn)

    const expectedNextDate = addMonths(scheduledDate, 1)

    const result = await completeCheckIn.execute({
      checkInId: checkIn.id,
      completionDate: createCompletionDate(new Date('2026-02-20')),
    })

    expect(result.nextCheckIn.scheduledDate).toEqual(expectedNextDate)
  })

  it('should allow completion without notes', async () => {
    const categoryId = createCategoryId()
    const category = createCategory({
      id: categoryId,
      name: createCategoryName('Friends'),
      frequency: createCheckInFrequency({ value: 1, unit: 'weeks' }),
    })
    await categoryRepository.save(category)

    const contactId = createContactId()
    const contact = createContact({
      id: contactId,
      name: 'Alice Brown',
      categoryId,
      importantDates: createImportantDateCollection([]),
    })
    await contactRepository.save(contact)

    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate: createScheduledDate(new Date('2026-02-01')),
    })
    await checkInRepository.save(checkIn)

    const result = await completeCheckIn.execute({
      checkInId: checkIn.id,
      completionDate: createCompletionDate(new Date('2026-02-01')),
    })

    expect(result.completedCheckIn.status).toBe(CheckInStatus.Completed)
    expect(isNullCheckInNotes(result.completedCheckIn.notes)).toBe(true)
  })

  it('should save both completed and next check-in to repository', async () => {
    const categoryId = createCategoryId()
    const category = createCategory({
      id: categoryId,
      name: createCategoryName('Friends'),
      frequency: createCheckInFrequency({ value: 1, unit: 'weeks' }),
    })
    await categoryRepository.save(category)

    const contactId = createContactId()
    const contact = createContact({
      id: contactId,
      name: 'Charlie Davis',
      categoryId,
      importantDates: createImportantDateCollection([]),
    })
    await contactRepository.save(contact)

    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate: createScheduledDate(new Date('2026-02-01')),
    })
    await checkInRepository.save(checkIn)

    const result = await completeCheckIn.execute({
      checkInId: checkIn.id,
      completionDate: createCompletionDate(new Date('2026-02-01')),
    })

    const savedCompleted = await checkInRepository.findById(
      result.completedCheckIn.id
    )
    const savedNext = await checkInRepository.findById(result.nextCheckIn.id)

    expect(savedCompleted).toBeDefined()
    expect(savedCompleted?.status).toBe(CheckInStatus.Completed)
    expect(savedNext).toBeDefined()
    expect(savedNext?.status).toBe(CheckInStatus.Scheduled)
  })

  it('should throw error when check-in not found', async () => {
    const nonExistentId = createCheckInId()

    await expect(
      completeCheckIn.execute({
        checkInId: nonExistentId,
        completionDate: createCompletionDate(new Date()),
      })
    ).rejects.toThrow('CheckIn not found')
  })

  it('should throw error when contact not found', async () => {
    const nonExistentContactId = createContactId()
    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId: nonExistentContactId,
      scheduledDate: createScheduledDate(new Date('2026-02-01')),
    })
    await checkInRepository.save(checkIn)

    await expect(
      completeCheckIn.execute({
        checkInId: checkIn.id,
        completionDate: createCompletionDate(new Date()),
      })
    ).rejects.toThrow('Contact not found')
  })

  it('should throw error when category not found', async () => {
    const nonExistentCategoryId = createCategoryId()
    const contactId = createContactId()
    const contact = createContact({
      id: contactId,
      name: 'Test User',
      categoryId: nonExistentCategoryId,
      importantDates: createImportantDateCollection([]),
    })
    await contactRepository.save(contact)

    const checkIn = createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate: createScheduledDate(new Date('2026-02-01')),
    })
    await checkInRepository.save(checkIn)

    await expect(
      completeCheckIn.execute({
        checkInId: checkIn.id,
        completionDate: createCompletionDate(new Date()),
      })
    ).rejects.toThrow('Category not found')
  })
})
