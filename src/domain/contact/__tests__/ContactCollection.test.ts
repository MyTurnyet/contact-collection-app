import { describe, it, expect } from "vitest";
import ContactCollection, {
  createContactCollection,
} from "../collections/ContactCollection";
import { createContact } from "../Contact";
import { createContactId } from "../ContactId";
import { createPhoneNumber } from "../PhoneNumber";
import { createEmailAddress } from "../EmailAddress";
import { createLocation } from "../Location";
import { createRelationshipContext } from "../RelationshipContext";

describe("ContactCollection", () => {
  describe("createContactCollection creates", () => {
    it("as empty", () => {
      const contactCollection: ContactCollection = createContactCollection([]);
      expect(contactCollection.isEmpty()).toBe(true);
      expect(contactCollection.size).toBe(0);
    });

    it("with one Contact", () => {
      const contact = createContact({
        id: createContactId(),
        name: "John Doe",
        phoneNumber: createPhoneNumber("555-123-4567"),
        emailAddress: createEmailAddress("john@example.com"),
        location: createLocation({
          city: "New York",
          state: "NY",
          country: "USA",
          timezone: "America/New_York",
        }),
        relationshipContext: createRelationshipContext("College friend"),
      });

      const contactCollection: ContactCollection = createContactCollection([
        contact,
      ]);
      expect(contactCollection.isEmpty()).toBe(false);
      expect(contactCollection.size).toBe(1);
    });

    it("with multiple Contacts", () => {
      const contact1 = createContact({
        id: createContactId(),
        name: "John Doe",
        phoneNumber: createPhoneNumber("555-123-4567"),
        emailAddress: createEmailAddress("john@example.com"),
        location: createLocation({
          city: "New York",
          country: "USA",
          timezone: "America/New_York",
        }),
        relationshipContext: createRelationshipContext("Friend"),
      });

      const contact2 = createContact({
        id: createContactId(),
        name: "Jane Smith",
        phoneNumber: createPhoneNumber("555-987-6543"),
        emailAddress: createEmailAddress("jane@example.com"),
        location: createLocation({
          city: "Seattle",
          country: "USA",
          timezone: "America/Los_Angeles",
        }),
        relationshipContext: createRelationshipContext("Family"),
      });

      const contactCollection = createContactCollection([contact1, contact2]);
      expect(contactCollection.isEmpty()).toBe(false);
      expect(contactCollection.size).toBe(2);
    });
  });

  describe("collection methods", () => {
    const contact1 = createContact({
      id: createContactId(),
      name: "Alice",
      phoneNumber: createPhoneNumber("555-111-1111"),
      emailAddress: createEmailAddress("alice@example.com"),
      location: createLocation({
        city: "Boston",
        country: "USA",
        timezone: "America/New_York",
      }),
      relationshipContext: createRelationshipContext("Friend"),
    });

    const contact2 = createContact({
      id: createContactId(),
      name: "Bob",
      phoneNumber: createPhoneNumber("555-222-2222"),
      emailAddress: createEmailAddress("bob@example.com"),
      location: createLocation({
        city: "Chicago",
        country: "USA",
        timezone: "America/Chicago",
      }),
      relationshipContext: createRelationshipContext("Family"),
    });

    it("forEach iterates over all items", () => {
      const collection = createContactCollection([contact1, contact2]);
      const names: string[] = [];
      collection.forEach((contact) => names.push(contact.name));
      expect(names).toEqual(["Alice", "Bob"]);
    });

    it("find returns matching item", () => {
      const collection = createContactCollection([contact1, contact2]);
      const found = collection.find((c) => c.name === "Bob");
      expect(found).toBe(contact2);
    });

    it("find returns undefined when no match", () => {
      const collection = createContactCollection([contact1, contact2]);
      const found = collection.find((c) => c.name === "Charlie");
      expect(found).toBeUndefined();
    });

    it("some returns true when predicate matches", () => {
      const collection = createContactCollection([contact1, contact2]);
      expect(collection.some((c) => c.name === "Alice")).toBe(true);
    });

    it("some returns false when no match", () => {
      const collection = createContactCollection([contact1, contact2]);
      expect(collection.some((c) => c.name === "Charlie")).toBe(false);
    });

    it("every returns true when all match", () => {
      const collection = createContactCollection([contact1, contact2]);
      expect(collection.every((c) => c.location.country === "USA")).toBe(true);
    });

    it("every returns false when not all match", () => {
      const collection = createContactCollection([contact1, contact2]);
      expect(collection.every((c) => c.name === "Alice")).toBe(false);
    });

    it("map transforms items", () => {
      const collection = createContactCollection([contact1, contact2]);
      const names = collection.map((c) => c.name);
      expect(names).toEqual(["Alice", "Bob"]);
    });

    it("filter returns new collection", () => {
      const collection = createContactCollection([contact1, contact2]);
      const filtered = collection.filter((c) => c.name === "Alice");
      expect(filtered.size).toBe(1);
      expect(filtered.find((c) => c.name === "Alice")).toBe(contact1);
    });

    it("toArray returns readonly array", () => {
      const collection = createContactCollection([contact1, contact2]);
      const array = collection.toArray();
      expect(array).toHaveLength(2);
      expect(array[0]).toBe(contact1);
    });
    
  });
});
