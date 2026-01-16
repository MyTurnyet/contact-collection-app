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

export function relationshipContextEquals(
  a: RelationshipContext,
  b: RelationshipContext
): boolean {
  return a === b
}

const NULL_RELATIONSHIP_CONTEXT: RelationshipContext = '' as RelationshipContext

export function createNullRelationshipContext(): RelationshipContext {
  return NULL_RELATIONSHIP_CONTEXT
}

export function isNullRelationshipContext(
  context: RelationshipContext
): boolean {
  return context === NULL_RELATIONSHIP_CONTEXT
}
