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

function frequencyToDays(frequency: CheckInFrequency): number {
  switch (frequency.unit) {
    case 'days':
      return frequency.value
    case 'weeks':
      return frequency.value * 7
    case 'months':
      return frequency.value * 30
  }
}

export function compareFrequencies(
  a: CheckInFrequency,
  b: CheckInFrequency
): number {
  return frequencyToDays(a) - frequencyToDays(b)
}

export function formatFrequency(frequency: CheckInFrequency): string {
  if (isNullCheckInFrequency(frequency)) {
    return 'Never'
  }
  const value = frequency.value
  const unit = value === 1 ? frequency.unit.slice(0, -1) : frequency.unit
  return `Every ${value} ${unit}`
}

const NULL_FREQUENCY = Object.freeze<CheckInFrequency>({
  value: 0,
  unit: 'days',
})

export function createNullCheckInFrequency(): CheckInFrequency {
  return NULL_FREQUENCY
}

export function isNullCheckInFrequency(
  frequency: CheckInFrequency
): boolean {
  return frequency === NULL_FREQUENCY
}
