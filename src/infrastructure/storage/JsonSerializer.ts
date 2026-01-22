import type { Serializer, CollectionSerializer } from './Serializer'

export class JsonSerializer<T = unknown>
  implements Serializer<T>, CollectionSerializer<T>
{
  serialize(obj: T): string {
    return JSON.stringify(obj)
  }

  deserialize<U = T>(json: string): U {
    try {
      return this.parseWithDateRevival(json)
    } catch (error) {
      throw new Error(`Failed to deserialize JSON: ${error}`)
    }
  }

  serializeCollection(items: T[]): string {
    return JSON.stringify(items)
  }

  deserializeCollection<U = T>(json: string): U[] {
    try {
      return this.parseWithDateRevival(json)
    } catch (error) {
      throw new Error(`Failed to deserialize JSON collection: ${error}`)
    }
  }

  private parseWithDateRevival<U>(json: string): U {
    return JSON.parse(json, (_key: string, value: unknown) => {
      if (typeof value === 'string' && this.isIsoDateString(value)) {
        return new Date(value)
      }
      return value
    })
  }

  private isIsoDateString(value: string): boolean {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
    return isoDatePattern.test(value)
  }
}
