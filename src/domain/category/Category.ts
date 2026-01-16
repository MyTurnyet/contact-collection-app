import { type CategoryId, categoryIdEquals } from './CategoryId'
import { type CategoryName, categoryNameEquals } from './CategoryName'
import {
  type CheckInFrequency,
  checkInFrequencyEquals,
} from './CheckInFrequency'

export interface Category {
  readonly id: CategoryId
  readonly name: CategoryName
  readonly frequency: CheckInFrequency
}

interface CategoryInput {
  id: CategoryId
  name: CategoryName
  frequency: CheckInFrequency
}

export function createCategory(input: CategoryInput): Category {
  return Object.freeze(buildCategory(input))
}

function buildCategory(input: CategoryInput): Category {
  return {
    id: input.id,
    name: input.name,
    frequency: input.frequency,
  }
}

export function categoryEquals(a: Category, b: Category): boolean {
  return (
    categoryIdEquals(a.id, b.id) &&
    categoryNameEquals(a.name, b.name) &&
    checkInFrequencyEquals(a.frequency, b.frequency)
  )
}
