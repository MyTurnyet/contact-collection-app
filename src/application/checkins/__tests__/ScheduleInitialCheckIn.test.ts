import { describe, it, expect, beforeEach } from 'vitest'
import { ScheduleInitialCheckIn } from '../ScheduleInitialCheckIn'
import { InMemoryCheckInRepository } from '../test-doubles/InMemoryCheckInRepository'
import { InMemoryContactRepository } from '../../contacts/test-doubles/InMemoryContactRepository'
import { InMemoryCategoryRepository } from '../../categories/test-doubles/InMemoryCategoryRepository'
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
import { CheckInStatus } from '../../../domain/checkin'

describe('ScheduleInitialCheckIn', () => {
  let checkInRepository: InMemoryCheckInRepository
  let contactRepository: InMemoryContactRepository
  let categoryRepository: InMemoryCategoryRepository
  let scheduleInitialCheckIn: ScheduleInitialCheckIn

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    contactRepository = new InMemoryContactRepository()
    categoryRepository = new InMemoryCategoryRepository()
    scheduleInitialCheckIn = new ScheduleInitialCheckIn(
      checkInRepository,
      contactRepository,
      categoryRepository
    )
  })

  it('should schedule a check-in for a contact with weekly frequency', async () => {
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

    const baseDate = new Date('2026-02-01')
    const checkIn = await scheduleInitialCheckIn.execute({
      contactId,
      baseDate,
    })

    expect(checkIn.contactId).toBe(contactId)
    expect(checkIn.status).toBe(CheckInStatus.Scheduled)
    expect(checkIn.scheduledDate).toEqual(new Date('2026-02-08'))
  })

  it('should schedule a check-in with monthly frequency', async () => {
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
      name: 'Jane Smith',
      categoryId,
      importantDates: createImportantDateCollection([]),
    })
    await contactRepository.save(contact)

    const baseDate = new Date('2026-02-01')
    const checkIn = await scheduleInitialCheckIn.execute({
      contactId,
      baseDate,
    })

    expect(checkIn.scheduledDate).toEqual(new Date('2026-03-01'))
  })

  it('should save the check-in to the repository', async () => {
    const categoryId = createCategoryId()
    const category = createCategory({
      id: categoryId,
      name: createCategoryName('Colleagues'),
      frequency: createCheckInFrequency({ value: 2, unit: 'weeks' }),
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

    const baseDate = new Date('2026-02-01')
    const checkIn = await scheduleInitialCheckIn.execute({
      contactId,
      baseDate,
    })

    const saved = await checkInRepository.findById(checkIn.id)
    expect(saved).toBeDefined()
    expect(saved?.contactId).toBe(contactId)
  })

  it('should use current date when baseDate not provided', async () => {
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

    const beforeExecution = new Date()
    const checkIn = await scheduleInitialCheckIn.execute({ contactId })

    expect(checkIn.scheduledDate.getTime()).toBeGreaterThanOrEqual(
      beforeExecution.getTime()
    )
  })

  it('should throw error when contact not found', async () => {
    const nonExistentId = createContactId()

    await expect(
      scheduleInitialCheckIn.execute({ contactId: nonExistentId })
    ).rejects.toThrow('Contact not found')
  })

  it('should throw error when category not found', async () => {
    const contactId = createContactId()
    const nonExistentCategoryId = createCategoryId()
    const contact = createContact({
      id: contactId,
      name: 'Charlie Davis',
      categoryId: nonExistentCategoryId,
      importantDates: createImportantDateCollection([]),
    })
    await contactRepository.save(contact)

    await expect(
      scheduleInitialCheckIn.execute({ contactId })
    ).rejects.toThrow('Category not found')
  })
})
