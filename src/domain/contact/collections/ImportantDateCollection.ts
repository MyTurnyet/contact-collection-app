import type { ImportantDate } from "../ImportantDate.ts";

class ImportantDateCollection {
  get size(): number {
    return this.items.length;
  }

  private items: ImportantDate[];

  constructor(items: ImportantDate[]) {
    this.items = items;
  }

  isEmpty(): boolean {
    return this.size == 0;
  }
}

export default ImportantDateCollection;

export function createImportantDateCollection(
  items: ImportantDate[],
): ImportantDateCollection {
  return new ImportantDateCollection(items);
}
