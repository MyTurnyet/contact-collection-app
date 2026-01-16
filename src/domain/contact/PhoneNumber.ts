export type PhoneNumber = string & { readonly __brand: 'PhoneNumber' }

export function createPhoneNumber(value: string): PhoneNumber {
  const normalized = normalizePhoneNumber(value)
  validatePhoneNumber(normalized)
  return normalized as PhoneNumber
}

function normalizePhoneNumber(value: string): string {
  const digits = extractDigits(value)
  return addCountryCode(digits)
}

function extractDigits(value: string): string {
  return value.replace(/\D/g, '')
}

function addCountryCode(digits: string): string {
  if (digits.startsWith('1')) return `+${digits}`
  return `+1${digits}`
}

function validatePhoneNumber(normalized: string): void {
  if (!isValidLength(normalized)) {
    throw new Error('Invalid phone number format')
  }
  if (!containsOnlyDigitsAndPlus(normalized)) {
    throw new Error('Invalid phone number format')
  }
}

function isValidLength(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10
}

function containsOnlyDigitsAndPlus(value: string): boolean {
  return /^\+\d+$/.test(value)
}
