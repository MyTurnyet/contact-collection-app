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

const NULL_CATEGORY_ID = categoryIdFromString(
  '00000000-0000-0000-0000-000000000000'
)

export function createNullCategoryId(): CategoryId {
  return NULL_CATEGORY_ID
}

export function isNullCategoryId(categoryId: CategoryId): boolean {
  return categoryId === NULL_CATEGORY_ID
}
