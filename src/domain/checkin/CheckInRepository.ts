import { type CheckIn } from './CheckIn'
import { type CheckInId } from './CheckInId'
import { type ContactId } from '../contact'
import type CheckInCollection from './collections/CheckInCollection'
import { CheckInStatus } from './CheckInStatus'

export interface CheckInRepository {
  save(checkIn: CheckIn): Promise<void>
  findById(id: CheckInId): Promise<CheckIn | null>
  findAll(): Promise<CheckInCollection>
  findByContactId(contactId: ContactId): Promise<CheckInCollection>
  findByStatus(status: CheckInStatus): Promise<CheckInCollection>
  findByDateRange(startDate: Date, endDate: Date): Promise<CheckInCollection>
  delete(id: CheckInId): Promise<void>
}
