import { describe, it, expect } from 'vitest'
import { GetDefaultCategories } from '../GetDefaultCategories'

describe('GetDefaultCategories', () => {
  it('should return default categories', () => {
    const getDefaultCategories = new GetDefaultCategories()

    const categories = getDefaultCategories.execute()

    expect(categories.length).toBeGreaterThan(0)
  })

  it('should return categories with Family', () => {
    const getDefaultCategories = new GetDefaultCategories()

    const categories = getDefaultCategories.execute()
    const familyCategory = categories.find((cat) => cat.name === 'Family')

    expect(familyCategory).toBeDefined()
  })

  it('should return categories with Friends', () => {
    const getDefaultCategories = new GetDefaultCategories()

    const categories = getDefaultCategories.execute()
    const friendsCategory = categories.find((cat) => cat.name === 'Friends')

    expect(friendsCategory).toBeDefined()
  })

  it('should return categories with valid data', () => {
    const getDefaultCategories = new GetDefaultCategories()

    const categories = getDefaultCategories.execute()

    categories.forEach((category) => {
      expect(category.id).toBeDefined()
      expect(category.name).toBeDefined()
      expect(category.frequency).toBeDefined()
    })
  })

  it('should return same categories on multiple calls', () => {
    const getDefaultCategories = new GetDefaultCategories()

    const categories1 = getDefaultCategories.execute()
    const categories2 = getDefaultCategories.execute()

    expect(categories1.length).toBe(categories2.length)
  })

  it('should include Colleagues category', () => {
    const getDefaultCategories = new GetDefaultCategories()

    const categories = getDefaultCategories.execute()
    const colleaguesCategory = categories.find(
      (cat) => cat.name === 'Colleagues'
    )

    expect(colleaguesCategory).toBeDefined()
  })

  it('should include Acquaintances category', () => {
    const getDefaultCategories = new GetDefaultCategories()

    const categories = getDefaultCategories.execute()
    const acquaintancesCategory = categories.find(
      (cat) => cat.name === 'Acquaintances'
    )

    expect(acquaintancesCategory).toBeDefined()
  })
})
