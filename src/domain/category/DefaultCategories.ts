import { type Category, createCategory } from './Category'
import { createCategoryId } from './CategoryId'
import { createCategoryName } from './CategoryName'
import {
  createCheckInFrequency,
  type FrequencyUnit,
} from './CheckInFrequency'

interface DefaultCategoryConfig {
  name: string
  value: number
  unit: FrequencyUnit
}

const DEFAULT_CATEGORY_CONFIGS: DefaultCategoryConfig[] = [
  { name: 'Family', value: 1, unit: 'weeks' },
  { name: 'Close Friends', value: 2, unit: 'weeks' },
  { name: 'Friends', value: 1, unit: 'months' },
  { name: 'Colleagues', value: 2, unit: 'months' },
  { name: 'Acquaintances', value: 3, unit: 'months' },
]

export function createDefaultCategories(): Category[] {
  return DEFAULT_CATEGORY_CONFIGS.map(createCategoryFromConfig)
}

function createCategoryFromConfig(
  config: DefaultCategoryConfig
): Category {
  return createCategory({
    id: createCategoryId(),
    name: createCategoryName(config.name),
    frequency: createCheckInFrequency({
      value: config.value,
      unit: config.unit,
    }),
  })
}
