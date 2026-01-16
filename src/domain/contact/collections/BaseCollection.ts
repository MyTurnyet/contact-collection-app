abstract class BaseCollection<T> {
  get size(): number {
    return this.items.length;
  }

  protected items: readonly T[];

  constructor(items: T[]) {
    this.items = Object.freeze([...items]);
  }

  isEmpty(): boolean {
    return this.size == 0;
  }

  getItems(): readonly T[] {
    return this.items;
  }

  forEach(callback: (item: T) => void): void {
    this.items.forEach(callback);
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  some(predicate: (item: T) => boolean): boolean {
    return this.items.some(predicate);
  }

  every(predicate: (item: T) => boolean): boolean {
    return this.items.every(predicate);
  }

  map<U>(transform: (item: T) => U): U[] {
    return this.items.map(transform);
  }

  filter(predicate: (item: T) => boolean): this {
    const filtered = this.items.filter(predicate);
    const Constructor = this.constructor as new (items: T[]) => this;
    return new Constructor(filtered);
  }

  toArray(): readonly T[] {
    return this.items;
  }
}

export default BaseCollection;
