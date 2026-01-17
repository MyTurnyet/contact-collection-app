import { type CategoryId, categoryIdEquals, categoryIdFromString } from './CategoryId'
import { type CategoryName, categoryNameEquals, createCategoryName } from './CategoryName'
import {
  type CheckInFrequency,
  checkInFrequencyEquals,
  createNullCheckInFrequency,
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

const NULL_CATEGORY: Category = Object.freeze({
  id: categoryIdFromString('00000000-0000-0000-0000-000000000000'),
  name: createCategoryName('Uncategorized'),
  frequency: createNullCheckInFrequency(),
})

export function createNullCategory(): Category {
  return NULL_CATEGORY
}

export function isNullCategory(category: Category): boolean {
  return category === NULL_CATEGORY
}
