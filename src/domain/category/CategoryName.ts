export type CategoryName = string & { readonly __brand: 'CategoryName' }

export function createCategoryName(value: string): CategoryName {
  const trimmed = value.trim()
  validateCategoryName(trimmed)
  return trimmed as CategoryName
}

function validateCategoryName(value: string): void {
  if (value.length === 0) {
    throw new Error('Category name cannot be empty')
  }
  if (value.length > 50) {
    throw new Error('Category name must be 50 characters or less')
  }
}

export function categoryNameEquals(
  a: CategoryName,
  b: CategoryName
): boolean {
  return a === b
}
