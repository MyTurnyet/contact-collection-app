import type { CategoryId } from '../../domain/category/CategoryId'

const CATEGORY_COLORS = [
  'primary',
  'secondary',
  'success',
  'error',
  'warning',
  'info',
] as const

export type CategoryColor = typeof CATEGORY_COLORS[number]

/**
 * Get a consistent color for a category based on its ID
 */
export function getCategoryColor(categoryId: CategoryId): CategoryColor {
  // Use a simple hash of the categoryId to get a consistent color
  const hash = categoryId.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0)
  }, 0)

  const index = hash % CATEGORY_COLORS.length
  return CATEGORY_COLORS[index]
}
