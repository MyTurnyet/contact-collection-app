/**
 * Generic serializer for converting domain objects to/from storage format.
 */
export interface Serializer<T> {
  /**
   * Serializes a domain object to a JSON string.
   */
  serialize(obj: T): string

  /**
   * Deserializes a JSON string back to a domain object.
   * @throws Error if deserialization fails
   */
  deserialize(json: string): T
}

/**
 * Serializer for arrays of domain objects.
 */
export interface CollectionSerializer<T> {
  /**
   * Serializes an array of domain objects to a JSON string.
   */
  serializeCollection(items: T[]): string

  /**
   * Deserializes a JSON string back to an array of domain objects.
   * @throws Error if deserialization fails
   */
  deserializeCollection(json: string): T[]
}
