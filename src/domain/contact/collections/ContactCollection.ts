import type { Contact } from "../Contact";
import BaseCollection from "./BaseCollection";

class ContactCollection extends BaseCollection<Contact> {}

export default ContactCollection;

export function createContactCollection(items: Contact[]): ContactCollection {
  return new ContactCollection(items);
}
