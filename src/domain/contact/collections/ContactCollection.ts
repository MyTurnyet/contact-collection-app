import type { Contact } from "../Contact";

class ContactCollection {
  get size(): number {
    return this.items.length;
  }

  private items: Contact[];

  constructor(items: Contact[]) {
    this.items = items;
  }

  isEmpty(): boolean {
    return this.size == 0;
  }
}

export default ContactCollection;

export function createContactCollection(items: Contact[]): ContactCollection {
  return new ContactCollection(items);
}
