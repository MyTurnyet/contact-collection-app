import type { CheckInRepository } from '../../domain/checkin/CheckInRepository'
import type { CheckIn } from '../../domain/checkin/CheckIn'
import type { CheckInId } from '../../domain/checkin/CheckInId'
import { checkInIdEquals } from '../../domain/checkin/CheckInId'
import type { ContactId } from '../../domain/contact/ContactId'
import { contactIdEquals } from '../../domain/contact/ContactId'
import type CheckInCollection from '../../domain/checkin/collections/CheckInCollection'
import { createCheckInCollection } from '../../domain/checkin/collections/CheckInCollection'
import { CheckInStatus } from '../../domain/checkin/CheckInStatus'
import type { DateRange } from '../../domain/shared/DateRange'
import { isDateInRange } from '../../domain/shared/DateRange'
import type { StorageService } from '../storage/StorageService'
import type { CollectionSerializer } from '../storage/Serializer'

const STORAGE_KEY = 'checkins'

export class LocalStorageCheckInRepository implements CheckInRepository {
  private readonly storage: StorageService
  private readonly serializer: CollectionSerializer<CheckIn>

  constructor(
    storage: StorageService,
    serializer: CollectionSerializer<CheckIn>
  ) {
    this.storage = storage
    this.serializer = serializer
  }

  async save(checkIn: CheckIn): Promise<void> {
    const checkIns = await this.loadCheckIns()
    const updated = this.upsertCheckIn(checkIns, checkIn)
    this.persistCheckIns(updated)
  }

  async findById(id: CheckInId): Promise<CheckIn | null> {
    const checkIns = await this.loadCheckIns()
    return checkIns.find((c) => checkInIdEquals(c.id, id)) ?? null
  }

  async findAll(): Promise<CheckInCollection> {
    const checkIns = await this.loadCheckIns()
    return createCheckInCollection(checkIns)
  }

  async findByContactId(contactId: ContactId): Promise<CheckInCollection> {
    const checkIns = await this.loadCheckIns()
    const matches = this.filterByContactId(checkIns, contactId)
    return createCheckInCollection(matches)
  }

  async findByStatus(status: CheckInStatus): Promise<CheckInCollection> {
    const checkIns = await this.loadCheckIns()
    const matches = checkIns.filter((c) => c.status === status)
    return createCheckInCollection(matches)
  }

  async findByDateRange(range: DateRange): Promise<CheckInCollection> {
    const checkIns = await this.loadCheckIns()
    const matches = this.filterByDateRange(checkIns, range)
    return createCheckInCollection(matches)
  }

  async delete(id: CheckInId): Promise<void> {
    const checkIns = await this.loadCheckIns()
    const filtered = checkIns.filter((c) => !checkInIdEquals(c.id, id))
    this.persistCheckIns(filtered)
  }

  private async loadCheckIns(): Promise<CheckIn[]> {
    const data = this.storage.getItem(STORAGE_KEY)
    return data ? this.serializer.deserializeCollection(data) : []
  }

  private persistCheckIns(checkIns: CheckIn[]): void {
    const serialized = this.serializer.serializeCollection(checkIns)
    this.storage.setItem(STORAGE_KEY, serialized)
  }

  private upsertCheckIn(checkIns: CheckIn[], checkIn: CheckIn): CheckIn[] {
    const filtered = checkIns.filter((c) => !checkInIdEquals(c.id, checkIn.id))
    return [...filtered, checkIn]
  }

  private filterByContactId(
    checkIns: CheckIn[],
    contactId: ContactId
  ): CheckIn[] {
    return checkIns.filter((c) => contactIdEquals(c.contactId, contactId))
  }

  private filterByDateRange(checkIns: CheckIn[], range: DateRange): CheckIn[] {
    return checkIns.filter((c) => isDateInRange(c.scheduledDate, range))
  }
}
