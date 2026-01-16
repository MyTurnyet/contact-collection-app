import { type Category, createCategory } from './Category'
import { createCategoryId } from './CategoryId'
import { createCategoryName } from './CategoryName'
import { createCheckInFrequency } from './CheckInFrequency'

export function createDefaultCategories(): Category[] {
  return [
    createFamilyCategory(),
    createCloseFriendsCategory(),
    createFriendsCategory(),
    createColleaguesCategory(),
    createAcquaintancesCategory(),
  ]
}

function createFamilyCategory(): Category {
  return createCategory({
    id: createCategoryId(),
    name: createCategoryName('Family'),
    frequency: createCheckInFrequency({ value: 1, unit: 'weeks' }),
  })
}

function createCloseFriendsCategory(): Category {
  return createCategory({
    id: createCategoryId(),
    name: createCategoryName('Close Friends'),
    frequency: createCheckInFrequency({ value: 2, unit: 'weeks' }),
  })
}

function createFriendsCategory(): Category {
  return createCategory({
    id: createCategoryId(),
    name: createCategoryName('Friends'),
    frequency: createCheckInFrequency({ value: 1, unit: 'months' }),
  })
}

function createColleaguesCategory(): Category {
  return createCategory({
    id: createCategoryId(),
    name: createCategoryName('Colleagues'),
    frequency: createCheckInFrequency({ value: 2, unit: 'months' }),
  })
}

function createAcquaintancesCategory(): Category {
  return createCategory({
    id: createCategoryId(),
    name: createCategoryName('Acquaintances'),
    frequency: createCheckInFrequency({ value: 3, unit: 'months' }),
  })
}
