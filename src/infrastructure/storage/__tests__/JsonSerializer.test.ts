import { describe, it, expect } from 'vitest'
import { JsonSerializer } from '../JsonSerializer'

describe('JsonSerializer', () => {
  describe('serialize', () => {
    it('serializes simple objects to JSON string', () => {
      const serializer = new JsonSerializer()
      const obj = { name: 'John', age: 30 }

      const result = serializer.serialize(obj)

      expect(result).toBe('{"name":"John","age":30}')
    })

    it('serializes objects with Date fields', () => {
      const serializer = new JsonSerializer()
      const obj = { name: 'Event', date: new Date('2024-01-15T00:00:00.000Z') }

      const result = serializer.serialize(obj)

      expect(result).toContain('"date"')
      expect(result).toContain('2024-01-15')
    })

    it('serializes nested objects', () => {
      const serializer = new JsonSerializer()
      const obj = { user: { name: 'John', email: 'john@example.com' } }

      const result = serializer.serialize(obj)

      expect(JSON.parse(result)).toEqual(obj)
    })
  })

  describe('deserialize', () => {
    it('deserializes JSON string to object', () => {
      const serializer = new JsonSerializer()
      const json = '{"name":"John","age":30}'

      const result = serializer.deserialize<{ name: string; age: number }>(json)

      expect(result).toEqual({ name: 'John', age: 30 })
    })

    it('throws error for invalid JSON', () => {
      const serializer = new JsonSerializer()
      const invalidJson = '{ invalid json }'

      expect(() => serializer.deserialize(invalidJson)).toThrow()
    })

    it('deserializes Date fields from ISO strings', () => {
      const serializer = new JsonSerializer()
      const json = '{"name":"Event","date":"2024-01-15T00:00:00.000Z"}'

      const result = serializer.deserialize<{ name: string; date: Date }>(json)

      expect(result.date).toBeInstanceOf(Date)
      expect(result.date.toISOString()).toBe('2024-01-15T00:00:00.000Z')
    })
  })

  describe('serializeCollection', () => {
    it('serializes empty array', () => {
      const serializer = new JsonSerializer()

      const result = serializer.serializeCollection([])

      expect(result).toBe('[]')
    })

    it('serializes array of objects', () => {
      const serializer = new JsonSerializer()
      const items = [
        { id: '1', name: 'First' },
        { id: '2', name: 'Second' },
      ]

      const result = serializer.serializeCollection(items)

      expect(JSON.parse(result)).toEqual(items)
    })
  })

  describe('deserializeCollection', () => {
    it('deserializes empty array', () => {
      const serializer = new JsonSerializer()

      const result = serializer.deserializeCollection<unknown>('[]')

      expect(result).toEqual([])
    })

    it('deserializes array of objects', () => {
      const serializer = new JsonSerializer()
      const json = '[{"id":"1","name":"First"},{"id":"2","name":"Second"}]'

      const result = serializer.deserializeCollection<{
        id: string
        name: string
      }>(json)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ id: '1', name: 'First' })
    })

    it('throws error for invalid JSON array', () => {
      const serializer = new JsonSerializer()

      expect(() => serializer.deserializeCollection('invalid')).toThrow()
    })
  })
})
