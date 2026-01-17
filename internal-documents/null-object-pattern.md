# Null Object Pattern Documentation

## Overview

The null object pattern is implemented throughout the domain layer to eliminate `undefined` and `null` checks, providing safe default values that implement the same interface as real objects. This pattern improves type safety, simplifies code, and reduces null-reference errors.

## When to Use Null Objects vs Optional Values

### Use Null Objects When:

1. **Domain entities require all fields to be present** - The `Contact` entity always has a phone, email, location, and relationship context, even if the user hasn't provided them yet.

2. **Operations should work uniformly** - Code that processes contacts doesn't need conditional logic to handle missing values.

3. **You want to eliminate conditional checks** - Instead of:
   ```typescript
   if (contact.phone !== undefined) {
     display(contact.phone)
   }
   ```
   You can write:
   ```typescript
   if (!isNullPhoneNumber(contact.phone)) {
     display(contact.phone)
   }
   ```

4. **Default behavior is well-defined** - Null objects provide sensible defaults:
   - Null phone numbers display as empty string
   - Null locations default to "Unknown" city and "UTC" timezone
   - Null categories represent "Uncategorized"

### Use Optional Values When:

1. **Input DTOs and interfaces** - The `CreateContactInput` interface uses optional fields because users may not provide all data upfront.

2. **Truly optional data** - When absence of data has no meaningful default (e.g., `state` in Location is genuinely optional).

3. **External API boundaries** - When integrating with external systems where null/undefined has specific meaning.

## Checking for Null Objects

### Identity-Based Checks

All null objects use the singleton pattern, allowing fast identity checks:

```typescript
// Check for null phone number
if (isNullPhoneNumber(contact.phone)) {
  console.log('No phone number provided')
}

// Check for null email
if (isNullEmailAddress(contact.email)) {
  console.log('No email address provided')
}

// Check for null location
if (isNullLocation(contact.location)) {
  console.log('Location unknown')
}

// Check for null relationship context
if (isNullRelationshipContext(contact.relationshipContext)) {
  console.log('No relationship context specified')
}

// Check for null category
if (isNullCategory(category)) {
  console.log('Uncategorized')
}

// Check for null check-in frequency
if (isNullCheckInFrequency(category.frequency)) {
  console.log('Never check in')
}
```

### Why Identity Checks?

Identity checks (`===`) are:
- **Fast**: O(1) reference comparison
- **Safe**: No need to compare field values
- **Reliable**: Only the singleton null object will match

This is better than value-based checks:
```typescript
// ❌ Don't do this - expensive and fragile
if (phone.value === '' && phone.formatted === '') {
  // ...
}

// ✅ Do this instead - fast and reliable
if (isNullPhoneNumber(phone)) {
  // ...
}
```

## Singleton Pattern Implementation

### Creating Singletons

Each null object is created once and frozen:

```typescript
// PhoneNumber example
const NULL_PHONE_NUMBER: PhoneNumber = Object.freeze({
  value: '',
  formatted: '',
})

export function createNullPhoneNumber(): PhoneNumber {
  return NULL_PHONE_NUMBER
}

export function isNullPhoneNumber(phone: PhoneNumber): boolean {
  return phone === NULL_PHONE_NUMBER
}
```

### Key Characteristics

1. **Immutable**: `Object.freeze()` prevents modification
2. **Singleton**: Same instance returned every time
3. **Type-safe**: Implements the full interface
4. **Identifiable**: Identity check using `===`

### Memory Efficiency

Using singletons means:
- Only one null object instance per type exists in memory
- Multiple contacts can share the same null phone number instance
- No memory overhead for representing "no value"

## Benefits

### 1. Eliminates Null Checks

**Before (without null objects):**
```typescript
function displayContact(contact: Contact) {
  console.log(`Name: ${contact.name}`)

  if (contact.phone !== undefined) {
    console.log(`Phone: ${contact.phone}`)
  }

  if (contact.email !== undefined) {
    console.log(`Email: ${contact.email}`)
  }

  if (contact.location !== undefined) {
    console.log(`City: ${contact.location.city}`)
  }
}
```

**After (with null objects):**
```typescript
function displayContact(contact: Contact) {
  console.log(`Name: ${contact.name}`)

  if (!isNullPhoneNumber(contact.phone)) {
    console.log(`Phone: ${contact.phone}`)
  }

  if (!isNullEmailAddress(contact.email)) {
    console.log(`Email: ${contact.email}`)
  }

  if (!isNullLocation(contact.location)) {
    console.log(`City: ${contact.location.city}`)
  }
}
```

Even better, null objects can be displayed safely:
```typescript
function displayContact(contact: Contact) {
  console.log(`Name: ${contact.name}`)
  console.log(`Phone: ${contact.phone.formatted}`) // Empty string for null
  console.log(`Email: ${contact.email}`) // Empty string for null
  console.log(`City: ${contact.location.city}`) // "Unknown" for null
}
```

### 2. Type Safety

All fields are non-optional, which means:
- No `?.` optional chaining needed
- TypeScript knows fields always exist
- No runtime null-reference errors

```typescript
// ✅ Type-safe - contact.phone always exists
const phone: PhoneNumber = contact.phone

// ❌ With optionals - would need type guards
const phone: PhoneNumber | undefined = contact.phone
if (phone !== undefined) {
  // use phone
}
```

### 3. Simplified Equality Checks

**Before:**
```typescript
function optionalPhoneEquals(a?: PhoneNumber, b?: PhoneNumber): boolean {
  if (a === undefined && b === undefined) return true
  if (a === undefined || b === undefined) return false
  return phoneNumberEquals(a, b)
}
```

**After:**
```typescript
// Just use the equality function directly
phoneNumberEquals(contact1.phone, contact2.phone)
```

### 4. Consistent Behavior

Null objects provide predictable default behavior:
- Null phone numbers format as empty strings
- Null locations use UTC timezone
- Null categories never trigger check-ins
- All null objects are equal to themselves

### 5. Reduced Cognitive Load

Developers don't need to remember:
- Which fields are optional
- Where to add null checks
- How to handle undefined values

Instead, the domain model guarantees all fields exist.

## Trade-offs

### Advantages

1. **Eliminates null/undefined checks** in business logic
2. **Type safety** - all fields guaranteed to exist
3. **Consistent API** - same interface for real and null objects
4. **Fast identity checks** using `===`
5. **Memory efficient** - singletons shared across instances

### Considerations

1. **Must check for null objects** - Code needs to distinguish between real and null values when it matters
2. **Input layer complexity** - Need to convert from optional inputs to null objects at domain boundary
3. **Additional code** - Each value object needs null object implementation
4. **Learning curve** - Team needs to understand the pattern

### When NOT to Use

1. **External APIs** - JSON serialization may not preserve null objects
2. **Database persistence** - Need to convert null objects to NULL when saving
3. **Simple DTOs** - Input/output interfaces can remain with optional fields
4. **Truly optional data** - When absence has no meaningful default

## Implementation Patterns

### Value Object Pattern

```typescript
// 1. Define the type
export type PhoneNumber = string & { readonly __brand: 'PhoneNumber' }

// 2. Create the null singleton
const NULL_PHONE_NUMBER: PhoneNumber = Object.freeze('' as PhoneNumber)

// 3. Factory function
export function createNullPhoneNumber(): PhoneNumber {
  return NULL_PHONE_NUMBER
}

// 4. Identity check
export function isNullPhoneNumber(phone: PhoneNumber): boolean {
  return phone === NULL_PHONE_NUMBER
}
```

### Complex Value Object Pattern

```typescript
// 1. Define the interface
export interface Location {
  readonly city: string
  readonly state?: string
  readonly country: string
  readonly timezone: string
}

// 2. Create the null singleton with defaults
const NULL_LOCATION: Location = Object.freeze({
  city: 'Unknown',
  country: 'Unknown',
  timezone: 'UTC',
  state: undefined,
})

// 3. Factory function
export function createNullLocation(): Location {
  return NULL_LOCATION
}

// 4. Identity check
export function isNullLocation(location: Location): boolean {
  return location === NULL_LOCATION
}
```

### Entity Pattern

```typescript
// 1. Define the interface with required fields
export interface Contact {
  readonly id: ContactId
  readonly name: string
  readonly phone: PhoneNumber  // Non-optional
  readonly email: EmailAddress  // Non-optional
  readonly location: Location   // Non-optional
  readonly relationshipContext: RelationshipContext  // Non-optional
  readonly importantDates: ImportantDateCollection
}

// 2. Input interface with optional fields
interface ContactInput {
  id: ContactId
  name: string
  phone?: PhoneNumber
  email?: EmailAddress
  location?: Location
  relationshipContext?: RelationshipContext
  importantDates?: ImportantDateCollection
}

// 3. Factory converts undefined to null objects
export function createContact(input: ContactInput): Contact {
  return Object.freeze({
    id: input.id,
    name: input.name.trim(),
    phone: input.phone ?? createNullPhoneNumber(),
    email: input.email ?? createNullEmailAddress(),
    location: input.location ?? createNullLocation(),
    relationshipContext: input.relationshipContext ?? createNullRelationshipContext(),
    importantDates: input.importantDates ?? createImportantDateCollection([]),
  })
}
```

## Usage Examples

### Creating Contacts with Null Objects

```typescript
// Minimal contact - uses null objects for missing fields
const contact = createContact({
  id: createContactId(),
  name: 'John Doe',
})

// All fields exist, but some are null objects
console.log(isNullPhoneNumber(contact.phone)) // true
console.log(isNullEmailAddress(contact.email)) // true
console.log(isNullLocation(contact.location)) // true
```

### Displaying Contact Information

```typescript
function formatContactInfo(contact: Contact): string {
  const lines = [`Name: ${contact.name}`]

  // Only show non-null values
  if (!isNullPhoneNumber(contact.phone)) {
    lines.push(`Phone: ${contact.phone}`)
  }

  if (!isNullEmailAddress(contact.email)) {
    lines.push(`Email: ${contact.email}`)
  }

  if (!isNullLocation(contact.location)) {
    lines.push(`Location: ${contact.location.city}, ${contact.location.country}`)
  }

  if (!isNullRelationshipContext(contact.relationshipContext)) {
    lines.push(`Relationship: ${contact.relationshipContext}`)
  }

  return lines.join('\n')
}
```

### Checking for Complete Contacts

```typescript
function isContactComplete(contact: Contact): boolean {
  return (
    !isNullPhoneNumber(contact.phone) &&
    !isNullEmailAddress(contact.email) &&
    !isNullLocation(contact.location) &&
    !isNullRelationshipContext(contact.relationshipContext)
  )
}

function getMissingFields(contact: Contact): string[] {
  const missing: string[] = []

  if (isNullPhoneNumber(contact.phone)) missing.push('phone')
  if (isNullEmailAddress(contact.email)) missing.push('email')
  if (isNullLocation(contact.location)) missing.push('location')
  if (isNullRelationshipContext(contact.relationshipContext)) {
    missing.push('relationship context')
  }

  return missing
}
```

### Working with Categories

```typescript
function shouldCheckIn(contact: Contact, category: Category): boolean {
  // Null categories never require check-ins
  if (isNullCategory(category)) {
    return false
  }

  // Null frequency means never check in
  if (isNullCheckInFrequency(category.frequency)) {
    return false
  }

  // Check if enough time has passed based on frequency
  return checkIfTimeForCheckIn(contact, category.frequency)
}
```

## Best Practices

1. **Use null objects at domain boundaries** - Convert optional inputs to null objects when creating domain entities

2. **Check for null objects when it matters** - UI code needs to know if fields are missing, business logic often doesn't

3. **Provide meaningful defaults** - Null objects should have sensible default values (empty strings, "Unknown", UTC timezone)

4. **Export all helpers** - Make `createNull*()` and `isNull*()` functions available through domain module exports

5. **Test null object behavior** - Verify singletons, identity checks, equality, and default behavior

6. **Document null object semantics** - Make it clear what null objects represent in your domain

7. **Keep null objects simple** - They should be lightweight objects with minimal behavior

## Testing

### Test Singleton Behavior

```typescript
it('should return consistent singleton', () => {
  const null1 = createNullPhoneNumber()
  const null2 = createNullPhoneNumber()

  expect(null1).toBe(null2) // Same reference
})
```

### Test Identity Checks

```typescript
it('should identify null objects', () => {
  const nullPhone = createNullPhoneNumber()
  const realPhone = createPhoneNumber('555-1234')

  expect(isNullPhoneNumber(nullPhone)).toBe(true)
  expect(isNullPhoneNumber(realPhone)).toBe(false)
})
```

### Test Default Values

```typescript
it('should have default values', () => {
  const nullLocation = createNullLocation()

  expect(nullLocation.city).toBe('Unknown')
  expect(nullLocation.country).toBe('Unknown')
  expect(nullLocation.timezone).toBe('UTC')
})
```

### Test Equality

```typescript
it('should be equal to other null objects', () => {
  const null1 = createNullPhoneNumber()
  const null2 = createNullPhoneNumber()

  expect(phoneNumberEquals(null1, null2)).toBe(true)
})
```

## Conclusion

The null object pattern provides a robust alternative to optional types and null checks. By guaranteeing that all fields exist and providing sensible defaults, it simplifies code, improves type safety, and reduces the likelihood of null-reference errors. The trade-off is that code must explicitly check for null objects when the distinction matters, but this is more explicit and intentional than scattered null checks throughout the codebase.
