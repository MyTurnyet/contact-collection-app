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

export function locationEquals(a: Location, b: Location): boolean {
  return (
    a.city === b.city &&
    a.state === b.state &&
    a.country === b.country &&
    a.timezone === b.timezone
  )
}

const NULL_LOCATION: Location = Object.freeze({
  city: 'Unknown',
  country: 'Unknown',
  timezone: 'UTC',
  state: undefined,
})

export function createNullLocation(): Location {
  return NULL_LOCATION
}

export function isNullLocation(location: Location): boolean {
  return location === NULL_LOCATION
}
