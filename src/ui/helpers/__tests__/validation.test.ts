import { describe, it, expect } from 'vitest'
import {
  validatePhoneInput,
  validateEmailInput,
  validateLocationInput,
  getAvailableTimezones,
  getFrequencyOptions,
} from '../validation'

describe('validation helpers', () => {
  describe('validatePhoneInput', () => {
    it('should validate correct phone number with dashes', () => {
      // When
      const result = validatePhoneInput('555-123-4567')

      // Then
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should validate correct phone number with country code', () => {
      // When
      const result = validatePhoneInput('+1-555-123-4567')

      // Then
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject phone number with letters', () => {
      // When
      const result = validatePhoneInput('555-ABC-DEFG')

      // Then
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Invalid phone number')
    })

    it('should reject phone number that is too short', () => {
      // When
      const result = validatePhoneInput('555-12')

      // Then
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Invalid phone number')
    })

    it('should reject empty phone number', () => {
      // When
      const result = validatePhoneInput('')

      // Then
      expect(result.valid).toBe(false)
      expect(result.error).toContain('required')
    })
  })

  describe('validateEmailInput', () => {
    it('should validate correct email address', () => {
      // When
      const result = validateEmailInput('test@example.com')

      // Then
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should validate email with subdomain', () => {
      // When
      const result = validateEmailInput('user@mail.example.com')

      // Then
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject email without @', () => {
      // When
      const result = validateEmailInput('testexample.com')

      // Then
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Invalid email')
    })

    it('should reject email without domain', () => {
      // When
      const result = validateEmailInput('test@')

      // Then
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Invalid email')
    })

    it('should reject empty email', () => {
      // When
      const result = validateEmailInput('')

      // Then
      expect(result.valid).toBe(false)
      expect(result.error).toContain('required')
    })
  })

  describe('validateLocationInput', () => {
    it('should validate complete location', () => {
      // When
      const result = validateLocationInput({
        city: 'New York',
        country: 'USA',
        timezone: 'America/New_York',
      })

      // Then
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should validate location with state', () => {
      // When
      const result = validateLocationInput({
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
        timezone: 'America/Los_Angeles',
      })

      // Then
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject empty city', () => {
      // When
      const result = validateLocationInput({
        city: '',
        country: 'USA',
        timezone: 'America/New_York',
      })

      // Then
      expect(result.valid).toBe(false)
      expect(result.error).toContain('City is required')
    })

    it('should reject empty country', () => {
      // When
      const result = validateLocationInput({
        city: 'New York',
        country: '',
        timezone: 'America/New_York',
      })

      // Then
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Country is required')
    })

    it('should reject empty timezone', () => {
      // When
      const result = validateLocationInput({
        city: 'New York',
        country: 'USA',
        timezone: '',
      })

      // Then
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Timezone is required')
    })
  })

  describe('getAvailableTimezones', () => {
    it('should return list of common timezones', () => {
      // When
      const timezones = getAvailableTimezones()

      // Then
      expect(timezones).toBeInstanceOf(Array)
      expect(timezones.length).toBeGreaterThan(0)
      expect(timezones).toContain('America/New_York')
      expect(timezones).toContain('America/Los_Angeles')
      expect(timezones).toContain('Europe/London')
    })

    it('should return timezones in sorted order', () => {
      // When
      const timezones = getAvailableTimezones()

      // Then
      const sorted = [...timezones].sort()
      expect(timezones).toEqual(sorted)
    })
  })

  describe('getFrequencyOptions', () => {
    it('should return valid frequency options', () => {
      // When
      const options = getFrequencyOptions()

      // Then
      expect(options).toBeInstanceOf(Array)
      expect(options.length).toBeGreaterThan(0)
    })

    it('should include days option', () => {
      // When
      const options = getFrequencyOptions()

      // Then
      const daysOption = options.find((o) => o.unit === 'days')
      expect(daysOption).toBeDefined()
      expect(daysOption?.label).toBeTruthy()
      expect(daysOption?.minValue).toBeGreaterThan(0)
      expect(daysOption?.maxValue).toBeGreaterThanOrEqual(daysOption!.minValue)
    })

    it('should include weeks option', () => {
      // When
      const options = getFrequencyOptions()

      // Then
      const weeksOption = options.find((o) => o.unit === 'weeks')
      expect(weeksOption).toBeDefined()
      expect(weeksOption?.label).toBeTruthy()
    })

    it('should include months option', () => {
      // When
      const options = getFrequencyOptions()

      // Then
      const monthsOption = options.find((o) => o.unit === 'months')
      expect(monthsOption).toBeDefined()
      expect(monthsOption?.label).toBeTruthy()
    })
  })
})
