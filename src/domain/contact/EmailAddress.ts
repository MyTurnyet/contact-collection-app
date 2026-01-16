export type EmailAddress = string & { readonly __brand: 'EmailAddress' }

export function createEmailAddress(value: string): EmailAddress {
  const normalized = normalizeEmail(value)
  validateEmail(normalized)
  return normalized as EmailAddress
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

function validateEmail(email: string): void {
  if (!isValidFormat(email)) {
    throw new Error('Invalid email address format')
  }
}

function isValidFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function emailAddressEquals(
  a: EmailAddress,
  b: EmailAddress
): boolean {
  return a === b
}
