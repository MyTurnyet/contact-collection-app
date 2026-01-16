# Contact Domain Refactoring Suggestions

**Date**: 2026-01-16
**Scope**: `src/domain/contact/` directory
**Purpose**: Improve code effectiveness and extensibility

---

## HIGH PRIORITY

### 1. Extract Generic Collection Base Class

**Issue**: ContactCollection.ts:3-17 and ImportantDateCollection.ts:3-17 are identical except for the type parameter.

**Current duplication**:
```typescript
// Duplicated in both collection classes
class XCollection {
  get size(): number {
    return this.items.length;
  }
  private items: X[];
  constructor(items: X[]) {
    this.items = items;
  }
  isEmpty(): boolean {
    return this.size == 0;
  }
}
```

**Recommendation**: Create a generic base collection class:

**File**: `collections/BaseCollection.ts`
```typescript
abstract class BaseCollection<T> {
  get size(): number {
    return this.items.length;
  }

  protected items: T[];

  constructor(items: T[]) {
    this.items = items;
  }

  isEmpty(): boolean {
    return this.size == 0;
  }
}
```

Then make specific collections extend it:
```typescript
class ContactCollection extends BaseCollection<Contact> {}
class ImportantDateCollection extends BaseCollection<ImportantDate> {}
```

**Impact**:
- Eliminates code duplication (DRY principle)
- Single point of change for collection behavior
- Makes adding new collection types trivial
- Easier to add features to all collections at once

---

### 2. Fix Import Path Inconsistency

**Issue**: Contact.ts:6-7 uses `.ts` extensions while no other files in the codebase do.

**Current**:
```typescript
import type ImportantDateCollection from './collections/ImportantDateCollection.ts'
import { createImportantDateCollection } from './collections/ImportantDateCollection.ts'
```

**Recommendation**: Remove `.ts` extensions for consistency:
```typescript
import type ImportantDateCollection from './collections/ImportantDateCollection'
import { createImportantDateCollection } from './collections/ImportantDateCollection'
```

**Impact**:
- Maintains consistency across codebase
- Follows TypeScript/ES module conventions
- Prevents potential tooling issues

---

## MEDIUM PRIORITY

### 3. Add Collection Access Methods

**Issue**: Collections only expose `size` and `isEmpty()`, with no way to access or iterate items.

**Current limitation**: Cannot iterate over contacts or important dates in a collection without breaking encapsulation.

**Recommendation**: Add essential access methods to BaseCollection:

```typescript
abstract class BaseCollection<T> {
  // ... existing code ...

  getItems(): readonly T[] {
    return Object.freeze([...this.items]);
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
}
```

**Impact**:
- Makes collections actually usable for iteration
- Maintains encapsulation (returns frozen/readonly arrays)
- Enables common collection operations
- Follows standard collection API patterns

---

### 4. Ensure Collection Immutability

**Issue**: Collections store mutable array that could be modified internally, breaking immutability guarantees.

**Current**:
```typescript
constructor(items: T[]) {
  this.items = items;  // Stores reference to potentially mutable array
}
```

**Recommendation**: Freeze the items array in constructor:
```typescript
constructor(items: T[]) {
  this.items = Object.freeze([...items]);
}
```

**Impact**:
- Guarantees true immutability
- Aligns with value object semantics
- Prevents accidental mutations
- Makes collections safer for concurrent operations

---

### 5. Consider Collection Transformation Methods

**Issue**: No way to transform collections (map, filter) without converting to/from arrays manually.

**Recommendation**: Add transformation methods that work with the collection abstraction:

```typescript
abstract class BaseCollection<T> {
  // ... existing code ...

  map<U>(transform: (item: T) => U): U[] {
    return this.items.map(transform);
  }

  filter(predicate: (item: T) => boolean): this {
    const filtered = this.items.filter(predicate);
    return new (this.constructor as any)(filtered);
  }

  toArray(): readonly T[] {
    return Object.freeze([...this.items]);
  }
}
```

**Impact**:
- Enables functional programming patterns
- Maintains collection abstraction
- Reduces boilerplate in business logic
- More expressive domain code

**Note**: `filter()` returns same collection type, `map()` returns array since result type may differ.

---

## LOW PRIORITY

### 6. Add Value Object Equality Methods

**Issue**: No way to compare value objects for equality (Contact, ImportantDate, PhoneNumber, etc.).

**Example use case**: Testing if two contacts are equal, or if a contact's phone number matches a search term.

**Recommendation**: Add equals methods to value objects:

```typescript
// Example for PhoneNumber
export function phoneNumberEquals(a: PhoneNumber, b: PhoneNumber): boolean {
  return a === b;  // Works because both are normalized strings
}

// Example for Contact (structural equality)
export function contactEquals(a: Contact, b: Contact): boolean {
  return a.id === b.id &&
         a.name === b.name &&
         phoneNumberEquals(a.phoneNumber, b.phoneNumber) &&
         emailAddressEquals(a.emailAddress, b.emailAddress) &&
         locationEquals(a.location, b.location) &&
         relationshipContextEquals(a.relationshipContext, b.relationshipContext);
}
```

**Impact**:
- Useful for testing and assertions
- Enables comparison in business logic
- Can use deep comparison libraries as workaround
- Not critical for current functionality

---

### 7. Document Validation Architecture Decision

**Observation**: Contact.ts:34-36 only validates the `name` field directly, relying on value object constructors for other field validations.

**Current pattern**:
```typescript
function validateContact(input: ContactInput): void {
  validateName(input.name)  // Only validates name
  // Other fields validated by their constructors (PhoneNumber, EmailAddress, etc.)
}
```

**Recommendation**: This is actually a **good pattern** - validation happens at value object creation, following single responsibility principle. Consider documenting this architectural decision.

**Suggested documentation** (add to `.claude/rules.md` or `CLAUDE.md`):
```markdown
### Validation Strategy
- **Value objects**: Validate in factory functions (createPhoneNumber, createEmailAddress, etc.)
- **Entities**: Only validate fields not covered by value objects (e.g., Contact validates name)
- **Rationale**: Validation at construction ensures invalid states cannot exist; entity validators don't duplicate value object validations
```

**Impact**:
- Clarifies architectural intent
- Prevents future developers from adding redundant validation
- Documents why Contact validation seems "incomplete"

---

## Summary

### Must Fix Now
1. **Extract generic BaseCollection class** - Eliminates duplication in ContactCollection and ImportantDateCollection
2. **Fix import path inconsistency** - Remove `.ts` extensions from Contact.ts imports

### Should Add Soon
3. **Add collection access methods** - Collections are currently not very usable without iteration capabilities

### Can Defer
4. **Ensure collection immutability** - Nice-to-have for additional safety
5. **Add transformation methods** - Improves ergonomics but not critical
6. **Add equality methods** - Useful for testing, can work around with libraries
7. **Document validation strategy** - Clarifies architecture but code works fine

---

## Recommended Implementation Order

1. **#2 (Import fix)** - Quick win, 2 line change
2. **#1 (BaseCollection)** - Foundation for #3, #4, #5
3. **#3 (Access methods)** - Makes collections usable
4. **#4 (Immutability)** - Easy addition to BaseCollection constructor
5. **#5 (Transformations)** - Optional enhancements
6. **#7 (Documentation)** - Document what we've learned
7. **#6 (Equality)** - Add only when needed by business logic

**Most Impactful First Step**: Extract BaseCollection class (#1) - this enables all other collection improvements and immediately eliminates duplication.
