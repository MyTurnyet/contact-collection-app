import { v4 as uuidv4, validate as validateUuid } from 'uuid'

export type CategoryId = string & { readonly __brand: 'CategoryId' }

export function createCategoryId(): CategoryId {
  return uuidv4() as CategoryId
}

export function categoryIdFromString(value: string): CategoryId {
  if (!isValidUuid(value)) {
    throw new Error('Invalid CategoryId format')
  }
  return value as CategoryId
}

function isValidUuid(value: string): boolean {
  return value.length > 0 && validateUuid(value)
}

export function categoryIdEquals(a: CategoryId, b: CategoryId): boolean {
  return a === b
}
