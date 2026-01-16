import { describe, it, expect } from 'vitest'
import { createLocation } from './Location'

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
