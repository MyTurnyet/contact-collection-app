export type FrequencyUnit = 'days' | 'weeks' | 'months'

export interface CheckInFrequency {
  readonly value: number
  readonly unit: FrequencyUnit
}

interface CheckInFrequencyInput {
  value: number
  unit: FrequencyUnit
}

export function createCheckInFrequency(
  input: CheckInFrequencyInput
): CheckInFrequency {
  validateFrequency(input)
  return Object.freeze(createFrequencyObject(input))
}

function validateFrequency(input: CheckInFrequencyInput): void {
  validateValue(input.value)
}

function validateValue(value: number): void {
  if (value <= 0) {
    throw new Error('Frequency value must be greater than 0')
  }
  if (!Number.isInteger(value)) {
    throw new Error('Frequency value must be a whole number')
  }
  if (value > 365) {
    throw new Error('Frequency value cannot exceed 365')
  }
}

function createFrequencyObject(
  input: CheckInFrequencyInput
): CheckInFrequency {
  return {
    value: input.value,
    unit: input.unit,
  }
}

export function checkInFrequencyEquals(
  a: CheckInFrequency,
  b: CheckInFrequency
): boolean {
  return a.value === b.value && a.unit === b.unit
}
