export type RelationshipContext = string & {
  readonly __brand: 'RelationshipContext'
}

export function createRelationshipContext(
  value: string
): RelationshipContext {
  const trimmed = value.trim()
  validateContext(trimmed)
  return trimmed as RelationshipContext
}

function validateContext(value: string): void {
  if (value.length === 0) {
    throw new Error('Relationship context cannot be empty')
  }
}
