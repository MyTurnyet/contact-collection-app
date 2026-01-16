import { describe, it, expect } from 'vitest'
import {
  createLocation,
  locationEquals,
  createNullLocation,
  isNullLocation,
} from '../Location'

describe('Location', () => {
  describe('createLocation', () => {
    it('should create Location with city, state, and timezone', () => {
      const location = createLocation({
        city: 'New York',
        state: 'NY',
        country: 'USA',
        timezone: 'America/New_York',
      })

      expect(location).toBeDefined()
      expect(location.city).toBe('New York')
      expect(location.state).toBe('NY')
      expect(location.country).toBe('USA')
      expect(location.timezone).toBe('America/New_York')
    })

    it('should create Location without state', () => {
      const location = createLocation({
        city: 'London',
        country: 'UK',
        timezone: 'Europe/London',
      })

      expect(location.city).toBe('London')
      expect(location.state).toBeUndefined()
      expect(location.country).toBe('UK')
    })

    it('should throw error for empty city', () => {
      expect(() =>
        createLocation({
          city: '',
          country: 'USA',
          timezone: 'America/New_York',
        })
      ).toThrow('City is required')
    })

    it('should throw error for empty country', () => {
      expect(() =>
        createLocation({
          city: 'New York',
          country: '',
          timezone: 'America/New_York',
        })
      ).toThrow('Country is required')
    })

    it('should throw error for empty timezone', () => {
      expect(() =>
        createLocation({
          city: 'New York',
          country: 'USA',
          timezone: '',
        })
      ).toThrow('Timezone is required')
    })

    it('should create immutable Location', () => {
      const location = createLocation({
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
        timezone: 'America/Los_Angeles',
      })

      expect(() => {
        // @ts-expect-error - Testing immutability
        location.city = 'Portland'
      }).toThrow()
    })
  })
})

  describe("locationEquals", () => {
    it("should return true for same locations", () => {
      const loc1 = createLocation({
        city: "New York",
        state: "NY",
        country: "USA",
        timezone: "America/New_York",
      })
      const loc2 = createLocation({
        city: "New York",
        state: "NY",
        country: "USA",
        timezone: "America/New_York",
      })

      expect(locationEquals(loc1, loc2)).toBe(true)
    })

    it("should return false for different locations", () => {
      const loc1 = createLocation({
        city: "New York",
        country: "USA",
        timezone: "America/New_York",
      })
      const loc2 = createLocation({
        city: "Boston",
        country: "USA",
        timezone: "America/New_York",
      })

      expect(locationEquals(loc1, loc2)).toBe(false)
    })
  })

  describe('createNullLocation', () => {
    it('should return consistent singleton', () => {
      const null1 = createNullLocation()
      const null2 = createNullLocation()

      expect(null1).toBe(null2)
    })

    it('should have default values for city, country, and timezone', () => {
      const nullLocation = createNullLocation()

      expect(nullLocation.city).toBe('Unknown')
      expect(nullLocation.country).toBe('Unknown')
      expect(nullLocation.timezone).toBe('UTC')
    })

    it('should have undefined state', () => {
      const nullLocation = createNullLocation()

      expect(nullLocation.state).toBeUndefined()
    })

    it('should have UTC as timezone', () => {
      const nullLocation = createNullLocation()

      expect(nullLocation.timezone).toBe('UTC')
    })

    it('should be equal to other null locations', () => {
      const null1 = createNullLocation()
      const null2 = createNullLocation()

      expect(locationEquals(null1, null2)).toBe(true)
    })
  })

  describe('isNullLocation', () => {
    it('should return true for null location', () => {
      const nullLocation = createNullLocation()

      expect(isNullLocation(nullLocation)).toBe(true)
    })

    it('should return false for real location', () => {
      const location = createLocation({
        city: 'New York',
        country: 'USA',
        timezone: 'America/New_York',
      })

      expect(isNullLocation(location)).toBe(false)
    })

    it('should return false for different real locations', () => {
      const location1 = createLocation({
        city: 'New York',
        country: 'USA',
        timezone: 'America/New_York',
      })
      const location2 = createLocation({
        city: 'Boston',
        country: 'USA',
        timezone: 'America/New_York',
      })

      expect(isNullLocation(location1)).toBe(false)
      expect(isNullLocation(location2)).toBe(false)
    })
  })
