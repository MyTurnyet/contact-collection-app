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
});
