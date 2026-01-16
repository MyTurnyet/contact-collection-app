export interface Location {
  readonly city: string
  readonly state?: string
  readonly country: string
  readonly timezone: string
}

interface LocationInput {
  city: string
  state?: string
  country: string
  timezone: string
}

export function createLocation(input: LocationInput): Location {
  validateLocation(input)
  return Object.freeze(createLocationObject(input))
}

function validateLocation(input: LocationInput): void {
  validateCity(input.city)
  validateCountry(input.country)
  validateTimezone(input.timezone)
}

function createLocationObject(input: LocationInput): Location {
  return {
    city: input.city,
    state: input.state,
    country: input.country,
    timezone: input.timezone,
  }
}

function validateCity(city: string): void {
  if (!city || city.trim().length === 0) {
    throw new Error('City is required')
  }
}

function validateCountry(country: string): void {
  if (!country || country.trim().length === 0) {
    throw new Error('Country is required')
  }
}

function validateTimezone(timezone: string): void {
  if (!timezone || timezone.trim().length === 0) {
    throw new Error('Timezone is required')
  }
}
