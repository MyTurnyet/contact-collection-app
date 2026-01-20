import type { CheckIn } from '../CheckIn'
import BaseCollection from '../../contact/collections/BaseCollection'

class CheckInCollection extends BaseCollection<CheckIn> {}

export default CheckInCollection

export function createCheckInCollection(items: CheckIn[]): CheckInCollection {
  return new CheckInCollection(items)
}
