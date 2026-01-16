import { describe, it, expect } from 'vitest'
import { createCategoryCollection } from '../collections/CategoryCollection'
import { createCategory } from '../Category'
import { createCategoryId } from '../CategoryId'
import { createCategoryName } from '../CategoryName'
import { createCheckInFrequency } from '../CheckInFrequency'

describe('CategoryCollection', () => {
  describe('createCategoryCollection creates', () => {
    it('as empty', () => {
      const categoryCollection = createCategoryCollection([])

      expect(categoryCollection.isEmpty()).toBe(true)
      expect(categoryCollection.size).toBe(0)
    })

    it('with one Category', () => {
      const category = createCategory({
        id: createCategoryId(),
        name: createCategoryName('Family'),
        frequency: createCheckInFrequency({ value: 1, unit: 'weeks' }),
      })

      const categoryCollection = createCategoryCollection([category])

      expect(categoryCollection.isEmpty()).toBe(false)
      expect(categoryCollection.size).toBe(1)
    })

    it('with multiple Categories', () => {
      const category1 = createCategory({
        id: createCategoryId(),
        name: createCategoryName('Family'),
        frequency: createCheckInFrequency({ value: 1, unit: 'weeks' }),
      })

      const category2 = createCategory({
        id: createCategoryId(),
        name: createCategoryName('Friends'),
        frequency: createCheckInFrequency({ value: 2, unit: 'weeks' }),
      })

      const categoryCollection = createCategoryCollection([
        category1,
        category2,
      ])

      expect(categoryCollection.isEmpty()).toBe(false)
      expect(categoryCollection.size).toBe(2)
    })
  })

  describe('collection methods', () => {
    const category1 = createCategory({
      id: createCategoryId(),
      name: createCategoryName('Family'),
      frequency: createCheckInFrequency({ value: 1, unit: 'weeks' }),
    })

    const category2 = createCategory({
      id: createCategoryId(),
      name: createCategoryName('Friends'),
      frequency: createCheckInFrequency({ value: 2, unit: 'weeks' }),
    })

    it('getItems returns readonly array', () => {
      const collection = createCategoryCollection([category1, category2])
      const items = collection.getItems()

      expect(items).toHaveLength(2)
      expect(items[0]).toBe(category1)
    })

    it('forEach iterates over all items', () => {
      const collection = createCategoryCollection([category1, category2])
      const names: string[] = []

      collection.forEach((category) => names.push(category.name))

      expect(names).toEqual(['Family', 'Friends'])
    })

    it('find returns matching item', () => {
      const collection = createCategoryCollection([category1, category2])

      const found = collection.find((c) => c.name === 'Friends')

      expect(found).toBe(category2)
    })

    it('find returns undefined when no match', () => {
      const collection = createCategoryCollection([category1, category2])

      const found = collection.find((c) => c.name === 'Colleagues')

      expect(found).toBeUndefined()
    })

    it('filter returns new collection', () => {
      const collection = createCategoryCollection([category1, category2])

      const filtered = collection.filter((c) => c.name === 'Family')

      expect(filtered.size).toBe(1)
      expect(filtered.find((c) => c.name === 'Family')).toBe(category1)
    })

    it('map transforms items', () => {
      const collection = createCategoryCollection([category1, category2])

      const names = collection.map((c) => c.name)

      expect(names).toEqual(['Family', 'Friends'])
    })

    it('collection is immutable', () => {
      const collection = createCategoryCollection([category1])
      const items = collection.getItems()

      expect(() => {
        // @ts-expect-error - Testing immutability
        items[0] = category2
      }).toThrow()
    })
  })
})
