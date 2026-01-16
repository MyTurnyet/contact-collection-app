import {
  createUuidValueObject,
  uuidValueObjectFromString,
  uuidValueObjectEquals,
} from '../shared/UuidValueObject'

export type CategoryId = string & { readonly __brand: 'CategoryId' }

export function createCategoryId(): CategoryId {
  return createUuidValueObject<CategoryId>()
}

export function categoryIdFromString(value: string): CategoryId {
  return uuidValueObjectFromString<CategoryId>(value, 'CategoryId')
}

export function categoryIdEquals(a: CategoryId, b: CategoryId): boolean {
  return uuidValueObjectEquals(a, b)
}
