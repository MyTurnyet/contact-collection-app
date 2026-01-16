import { v4 as uuidv4, validate as validateUuid } from 'uuid'

export function createUuidValueObject<T extends string>(): T {
  return uuidv4() as T
}

export function uuidValueObjectFromString<T extends string>(
  value: string,
  typeName: string
): T {
  if (!isValidUuid(value)) {
    throw new Error(`Invalid ${typeName} format`)
  }
  return value as T
}

function isValidUuid(value: string): boolean {
  return value.length > 0 && validateUuid(value)
}

export function uuidValueObjectEquals<T extends string>(
  a: T,
  b: T
): boolean {
  return a === b
}
