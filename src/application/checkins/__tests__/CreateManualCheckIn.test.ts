import { describe, it, expect, beforeEach } from 'vitest'
import { CreateManualCheckIn } from '../CreateManualCheckIn'
import { InMemoryCheckInRepository } from '../test-doubles/InMemoryCheckInRepository'
import { InMemoryContactRepository } from '../../contacts/test-doubles/InMemoryContactRepository'
import {
  createContact,
  createContactId,
  createImportantDateCollection,
} from '../../../domain/contact'
import { createCategoryId } from '../../../domain/category'
import { CheckInStatus, createCheckInNotes } from '../../../domain/checkin'

describe('CreateManualCheckIn', () => {
  let checkInRepository: InMemoryCheckInRepository
  let contactRepository: InMemoryContactRepository
  let createManualCheckIn: CreateManualCheckIn

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    contactRepository = new InMemoryContactRepository()
    createManualCheckIn = new CreateManualCheckIn(
      checkInRepository,
      contactRepository
    )
  })

  it('should create a manual check-in with specified date', async () => {
    const contactId = createContactId()
    const contact = createContact({
      id: contactId,
      name: 'John Doe',
      categoryId: createCategoryId(),
      importantDates: createImportantDateCollection([]),
    })
    await contactRepository.save(contact)

    const scheduledDate = new Date('2026-03-15')
    const checkIn = await createManualCheckIn.execute({
      contactId,
      scheduledDate,
    })

    expect(checkIn.contactId).toBe(contactId)
    expect(checkIn.scheduledDate).toEqual(scheduledDate)
    expect(checkIn.status).toBe(CheckInStatus.Scheduled)
  })

  it('should create a manual check-in with notes', async () => {
    const contactId = createContactId()
    const contact = createContact({
      id: contactId,
      name: 'Jane Smith',
      categoryId: createCategoryId(),
      importantDates: createImportantDateCollection([]),
    })
    await contactRepository.save(contact)

    const scheduledDate = new Date('2026-03-20')
    const notes = 'Follow up about project discussion'
    const checkIn = await createManualCheckIn.execute({
      contactId,
      scheduledDate,
      notes,
    })

    expect(checkIn.notes).toEqual(createCheckInNotes(notes))
  })

  it('should save the check-in to the repository', async () => {
    const contactId = createContactId()
    const contact = createContact({
      id: contactId,
      name: 'Bob Johnson',
      categoryId: createCategoryId(),
      importantDates: createImportantDateCollection([]),
    })
    await contactRepository.save(contact)

    const scheduledDate = new Date('2026-04-01')
    const checkIn = await createManualCheckIn.execute({
      contactId,
      scheduledDate,
    })

    const saved = await checkInRepository.findById(checkIn.id)
    expect(saved).toBeDefined()
    expect(saved?.contactId).toBe(contactId)
  })

  it('should throw error when contact not found', async () => {
    const nonExistentId = createContactId()
    const scheduledDate = new Date('2026-03-15')

    await expect(
      createManualCheckIn.execute({ contactId: nonExistentId, scheduledDate })
    ).rejects.toThrow('Contact not found')
  })

  it('should create check-in without notes when not provided', async () => {
    const contactId = createContactId()
    const contact = createContact({
      id: contactId,
      name: 'Alice Brown',
      categoryId: createCategoryId(),
      importantDates: createImportantDateCollection([]),
    })
    await contactRepository.save(contact)

    const scheduledDate = new Date('2026-03-25')
    const checkIn = await createManualCheckIn.execute({
      contactId,
      scheduledDate,
    })

    expect(checkIn.notes).toBeDefined()
  })
})
