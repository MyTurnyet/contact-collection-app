# Null Object Pattern Implementation Tasks

## Overview
Implement NullObject pattern for domain value objects to replace undefined/null checks with explicit, safe default objects that implement the same interface.

## Benefits
- Eliminate null/undefined checks throughout the codebase
- Provide safe, predictable default behavior
- Make code more readable and maintainable
- Reduce potential null reference errors

## Implementation Principles
1. Null objects should be immutable singletons
2. Null objects should implement the same interface as real objects
3. Null objects should be identifiable via `isNull()` method or similar
4. Null objects should provide safe default behavior
5. All null objects should be tested

---

## Contact Domain - Value Objects

### 1. PhoneNumber Null Object ✅ COMPLETE
**File**: `src/domain/contact/PhoneNumber.ts`

**Tasks**:
- [x] Create `createNullPhoneNumber()` factory function
- [x] Return a singleton null phone number instance
- [x] Null phone displays as empty string
- [x] Add `isNullPhoneNumber(phone: PhoneNumber): boolean` helper

**Tests** (`src/domain/contact/__tests__/PhoneNumber.test.ts`):
- [x] Test `createNullPhoneNumber()` returns consistent singleton
- [x] Test null phone number has expected display value
- [x] Test `isNullPhoneNumber()` returns true for null object
- [x] Test `isNullPhoneNumber()` returns false for real phone numbers
- [x] Test null phone number equality with other null phone numbers

### 2. EmailAddress Null Object ✅ COMPLETE
**File**: `src/domain/contact/EmailAddress.ts`

**Tasks**:
- [x] Create `createNullEmailAddress()` factory function
- [x] Return a singleton null email instance
- [x] Null email displays as empty string
- [x] Add `isNullEmailAddress(email: EmailAddress): boolean` helper

**Tests** (`src/domain/contact/__tests__/EmailAddress.test.ts`):
- [x] Test `createNullEmailAddress()` returns consistent singleton
- [x] Test null email has expected display value
- [x] Test `isNullEmailAddress()` returns true for null object
- [x] Test `isNullEmailAddress()` returns false for real emails
- [x] Test null email equality with other null emails

### 3. Location Null Object ✅ COMPLETE
**File**: `src/domain/contact/Location.ts`

**Tasks**:
- [x] Create `createNullLocation()` factory function
- [x] Return a singleton null location instance
- [x] Null location has default values: city="Unknown", country="Unknown", timezone="UTC"
- [x] Add `isNullLocation(location: Location): boolean` helper

**Tests** (`src/domain/contact/__tests__/Location.test.ts`):
- [x] Test `createNullLocation()` returns consistent singleton
- [x] Test null location has expected default values
- [x] Test `isNullLocation()` returns true for null object
- [x] Test `isNullLocation()` returns false for real locations
- [x] Test null location equality with other null locations
- [x] Test null location timezone is "UTC"

### 4. RelationshipContext Null Object ✅ COMPLETE
**File**: `src/domain/contact/RelationshipContext.ts`

**Tasks**:
- [x] Create `createNullRelationshipContext()` factory function
- [x] Return a singleton null relationship instance
- [x] Null relationship displays as empty string
- [x] Add `isNullRelationshipContext(context: RelationshipContext): boolean` helper

**Tests** (`src/domain/contact/__tests__/RelationshipContext.test.ts`):
- [x] Test `createNullRelationshipContext()` returns consistent singleton
- [x] Test null relationship has expected display value
- [x] Test `isNullRelationshipContext()` returns true for null object
- [x] Test `isNullRelationshipContext()` returns false for real contexts
- [x] Test null relationship equality with other null relationships

---

## Category Domain - Value Objects

### 5. Category Null Object ✅ COMPLETE
**File**: `src/domain/category/Category.ts`

**Tasks**:
- [x] Create `createNullCategory()` factory function
- [x] Null category represents "Uncategorized" or "No Category"
- [x] Null category should have a special CategoryId (e.g., "00000000-0000-0000-0000-000000000000")
- [x] Null category name: "Uncategorized"
- [x] Null category frequency: create a NullCheckInFrequency (never checks in)
- [x] Add `isNullCategory(category: Category): boolean` helper

**Tests** (`src/domain/category/__tests__/Category.test.ts`):
- [x] Test `createNullCategory()` returns consistent singleton
- [x] Test null category has special ID
- [x] Test null category name is "Uncategorized"
- [x] Test null category has null frequency
- [x] Test `isNullCategory()` returns true for null object
- [x] Test `isNullCategory()` returns false for real categories
- [x] Test null category equality with other null categories

### 6. CheckInFrequency Null Object ✅ COMPLETE
**File**: `src/domain/category/CheckInFrequency.ts`

**Tasks**:
- [x] Create `createNullCheckInFrequency()` factory function
- [x] Null frequency represents "Never" or no check-ins
- [x] Null frequency has 0 days value or special marker
- [x] Add `isNullCheckInFrequency(frequency: CheckInFrequency): boolean` helper

**Tests** (`src/domain/category/__tests__/CheckInFrequency.test.ts`):
- [x] Test `createNullCheckInFrequency()` returns consistent singleton
- [x] Test null frequency has 0 or special value for days
- [x] Test null frequency display shows "Never" or appropriate text
- [x] Test `isNullCheckInFrequency()` returns true for null object
- [x] Test `isNullCheckInFrequency()` returns false for real frequencies
- [x] Test null frequency equality with other null frequencies

---

## Contact Entity Updates

### 7. Update Contact to Use Null Objects
**File**: `src/domain/contact/Contact.ts`

**Tasks**:
- [ ] Update Contact interface to use null objects instead of optional fields
- [ ] Change `phone?: PhoneNumber` to `phone: PhoneNumber`
- [ ] Change `email?: EmailAddress` to `email: EmailAddress`
- [ ] Change `location?: Location` to `location: Location`
- [ ] Change `relationshipContext?: RelationshipContext` to `relationshipContext: RelationshipContext`
- [ ] Update `createContact()` to use null objects for missing values
- [ ] Update `contactEquals()` to handle null object comparisons
- [ ] Remove optional equality helper functions (no longer needed)

**Tests** (`src/domain/contact/__tests__/Contact.test.ts`):
- [ ] Update test: "should create Contact with only name" to verify null objects
- [ ] Test contact with only name has null phone, email, location, relationship
- [ ] Test `contactEquals()` works with null objects
- [ ] Test contacts with different null/real values are not equal
- [ ] Remove or update tests that check for undefined values

---

## Application Layer Updates

### 8. Update CreateContact Use Case
**File**: `src/application/contacts/CreateContact.ts`

**Tasks**:
- [ ] Update `buildContact()` to use null objects instead of undefined
- [ ] Update `buildLocation()` to return null location instead of undefined
- [ ] Update `buildRelationshipContext()` to return null context instead of undefined
- [ ] Update phone/email handling to use null objects

**Tests** (`src/application/contacts/__tests__/CreateContact.test.ts`):
- [ ] Update tests to verify null objects are used for missing fields
- [ ] Test contact with only name has null objects for other fields
- [ ] Verify saved contacts use null objects appropriately

---

## Domain Index Exports

### 9. Update Domain Module Exports
**File**: `src/domain/contact/index.ts`

**Tasks**:
- [ ] Export all null object factory functions
- [ ] Export all `isNull*()` helper functions
- [ ] Ensure consistent API across all value objects

**File**: `src/domain/category/index.ts`

**Tasks**:
- [ ] Export null category and frequency factories
- [ ] Export `isNull*()` helper functions

---

## Documentation

### 10. Document Null Object Pattern Usage

**File**: `internal-documents/null-object-pattern.md` (new file)

**Tasks**:
- [ ] Document when to use null objects vs optional values
- [ ] Provide examples of checking for null objects
- [ ] Document the singleton pattern used for null objects
- [ ] Explain benefits and trade-offs

---

## Testing Strategy

### General Test Requirements
For each null object implementation:
1. **Singleton test**: Verify same instance returned on multiple calls
2. **Identity test**: Verify `isNull*()` correctly identifies null objects
3. **Equality test**: Verify null objects equal other null objects
4. **Behavior test**: Verify null object provides safe default behavior
5. **Display test**: Verify null object has appropriate string representation

### Integration Testing
- [ ] Run full test suite after implementation
- [ ] Verify no regressions in existing tests
- [ ] Ensure all domain tests pass with null objects
- [ ] Ensure all application tests pass with null objects

---

## Implementation Order

Recommended sequence:
1. Start with simple value objects (PhoneNumber, EmailAddress, RelationshipContext)
2. Implement Location null object
3. Implement CheckInFrequency null object
4. Implement Category null object
5. Update Contact entity to use null objects
6. Update CreateContact use case
7. Update domain exports
8. Run full test suite and fix any issues
9. Write documentation

---

## Validation Checklist

Before considering this task complete:
- [ ] All null object factories implemented and tested
- [ ] All `isNull*()` helpers implemented and tested
- [ ] Contact entity updated to use null objects
- [ ] Application layer updated to use null objects
- [ ] All exports updated
- [ ] Full test suite passes
- [ ] No undefined checks remain in domain/application layers
- [ ] Documentation written
- [ ] Code follows 8-line method limit
- [ ] Code follows cognitive complexity limit of 4
