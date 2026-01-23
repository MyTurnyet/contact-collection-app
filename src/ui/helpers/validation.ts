/**
 * Form validation helpers for UI layer
 * Provides non-throwing validation functions for real-time form feedback
 */

export interface ValidationResult {
  valid: boolean
  error?: string
}

export interface LocationInput {
  city: string
  state?: string
  country: string
  timezone: string
}

export interface FrequencyOption {
  unit: 'days' | 'weeks' | 'months'
  label: string
  minValue: number
  maxValue: number
}

/**
 * Validate phone number input without throwing
 */
export function validatePhoneInput(value: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: 'Phone number is required' }
  }

  const normalized = normalizePhone(value)
  if (!isValidPhoneLength(normalized)) {
    return { valid: false, error: 'Invalid phone number format' }
  }

  if (!containsOnlyDigitsAndPlus(normalized)) {
    return { valid: false, error: 'Invalid phone number format' }
  }

  return { valid: true }
}

/**
 * Validate email address input without throwing
 */
export function validateEmailInput(value: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return { valid: false, error: 'Invalid email format' }
  }

  return { valid: true }
}

/**
 * Validate location input without throwing
 */
export function validateLocationInput(input: LocationInput): ValidationResult {
  if (!input.city || input.city.trim().length === 0) {
    return { valid: false, error: 'City is required' }
  }

  if (!input.country || input.country.trim().length === 0) {
    return { valid: false, error: 'Country is required' }
  }

  if (!input.timezone || input.timezone.trim().length === 0) {
    return { valid: false, error: 'Timezone is required' }
  }

  return { valid: true }
}

/**
 * Get list of commonly used timezones
 */
export function getAvailableTimezones(): string[] {
  return [
    'Africa/Cairo',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/New_York',
    'Asia/Kolkata',
    'Asia/Shanghai',
    'Asia/Tokyo',
    'Australia/Sydney',
    'Europe/London',
    'Europe/Paris',
    'Pacific/Auckland',
    'UTC',
  ].sort()
}

/**
 * Get frequency options for category check-in frequency
 */
export function getFrequencyOptions(): FrequencyOption[] {
  return [
    {
      unit: 'days',
      label: 'Days',
      minValue: 1,
      maxValue: 365,
    },
    {
      unit: 'weeks',
      label: 'Weeks',
      minValue: 1,
      maxValue: 52,
    },
    {
      unit: 'months',
      label: 'Months',
      minValue: 1,
      maxValue: 12,
    },
  ]
}

// Helper functions (extracted from domain layer logic)

function normalizePhone(value: string): string {
  return value.replace(/[\s()-]/g, '')
}

function isValidPhoneLength(normalized: string): boolean {
  const withoutPlus = normalized.replace(/^\+/, '')
  return withoutPlus.length >= 10 && withoutPlus.length <= 15
}

function containsOnlyDigitsAndPlus(normalized: string): boolean {
  return /^[+]?\d+$/.test(normalized)
}
