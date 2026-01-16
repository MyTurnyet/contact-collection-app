# Development Rules

## Code Style

### Size and Complexity Constraints
- **Maximum method size: 8 lines** - Extract helper methods liberally
- **Maximum cognitive complexity: 4** - Keep logic simple and focused
- If a method exceeds these limits, refactor immediately

### Object-Oriented Design Principles
- **Dependency Inversion**: Depend on interfaces, not concrete classes
- **Composition over inheritance**: Build complex behavior from simple objects
- **"Ask, Don't Tell"** principle - Objects should encapsulate behavior
- **No static methods or singleton objects** - All dependencies injected through constructors
- **All dependencies injected through constructors** - No service locators or globals
- **Immutability by default**: Use `const` over `let`, immutable data structures

### TypeScript Specifics
- Use strict mode (already configured)
- Define interfaces for all domain entities and value objects
- Use `readonly` properties for immutable objects
- Prefer `type` for unions and intersections, `interface` for object shapes
- No `any` types - use `unknown` if type is truly unknown

## Testing

### Test-Driven Development (TDD)
- **All code must follow TDD - tests written first**
- Write the test before writing production code
- Red-Green-Refactor cycle:
  1. Write failing test (RED)
  2. Write minimal code to pass (GREEN)
  3. Refactor while keeping tests green (REFACTOR)

### Testing Framework and Structure
- **Vitest** for all tests (configured with React Testing Library)
- **No mocking frameworks** - Create simple test implementations of interfaces
  - Example: Create `InMemoryContactRepository` for testing
  - Example: Create `FakeNotificationService` that captures calls for assertions
- **Test file organization**:
  - All tests must be in a `__tests__` directory within the same module/directory as the code being tested
  - Example: `src/domain/contact/ContactId.ts` → `src/domain/contact/__tests__/ContactId.test.ts`
- **Test file naming**: `{FileName}.test.ts` or `{FileName}.test.tsx`
- **One assertion concept per test method**
- **Given-When-Then structure** in tests:
  ```typescript
  it('should schedule next check-in from original date when completed', () => {
    // Given
    const contact = createTestContact()
    const checkIn = createTestCheckIn(contact, '2024-01-15')

    // When
    const result = completeCheckIn(checkIn, '2024-01-20')

    // Then
    expect(result.nextScheduledDate).toBe('2024-02-15')
  })
  ```

### Test Coverage Requirements
- 100% coverage for domain layer (pure business logic)
- 100% coverage for application layer (use cases)
- High coverage for infrastructure layer (adapters)
- Component tests with React Testing Library for UI

## Architecture

### Hexagonal/Ports & Adapters Architecture
- **Core domain logic has no framework dependencies**
- Domain layer: Pure TypeScript - no React, no LocalStorage, no browser APIs
- Application layer: Use cases and services - may reference domain, but no infrastructure
- Infrastructure layer: Adapters for LocalStorage, notifications, etc.
- UI layer: React components - only presentation logic

### Dependency Flow
**Always flows inward toward domain:**
```
UI → Infrastructure → Application → Domain
```
- Domain has zero external dependencies
- Application depends only on Domain
- Infrastructure depends on Application and Domain
- UI depends on all layers (via Dependency Injection)

### Interface Segregation
- Use interfaces for all cross-boundary communication
- Each use case should have its own interface
- Repository interfaces in domain, implementations in infrastructure
- Service interfaces in domain/application, implementations in infrastructure

### Repository Pattern
- All data access goes through repository interfaces
- Repositories defined in domain layer as interfaces
- Implementations in infrastructure layer (LocalStorageContactRepository, etc.)
- Repositories return domain entities, not DTOs or raw data

## Domain Modeling

### Validation Strategy
- **Value objects**: Validate in factory functions (e.g., `createPhoneNumber`, `createEmailAddress`)
  - Validation happens at construction time
  - Invalid states cannot exist - throw errors immediately
  - Each value object is responsible for its own validation rules
- **Entities**: Only validate fields not covered by value objects
  - Example: `Contact` validates the `name` field (plain string)
  - Does NOT re-validate `phoneNumber`, `emailAddress`, etc. (already validated by value object constructors)
- **Rationale**:
  - Single Responsibility Principle - validation logic lives where it belongs
  - Avoids duplication - entity validators don't repeat value object validation
  - Guarantees correctness - invalid value objects cannot be constructed
  - Clear error messages - validation failures occur at point of creation

### Value Objects
- Immutable objects with validation
- Examples: `ContactId`, `PhoneNumber`, `EmailAddress`, `CheckInFrequency`
- Validation in constructor - throw error if invalid
- Use TypeScript branded types for type safety:
  ```typescript
  type ContactId = string & { readonly brand: unique symbol }
  ```

### Entities
- Immutable objects with identity (ID)
- Examples: `Contact`, `Category`, `CheckIn`
- Use object spread for updates: `{ ...contact, name: newName }`
- No setter methods - create new instances

### Domain Services
- When logic doesn't belong to a single entity
- Examples: `DateCalculator`, `OverdueDetector`
- Stateless services with clear responsibilities

## React Best Practices

### Component Structure
- **Components only handle presentation** - No business logic in components
- **Business logic in custom hooks** that wrap use cases
- Use custom hooks: `useContacts()`, `useCategories()`, `useCheckIns()`
- Keep components small and focused (8 lines rule applies!)

### State Management
- Use React Context for Dependency Injection (not global state)
- Local state with `useState` for UI state
- Custom hooks for domain state management
- Lift state only when necessary

### Props and Types
- TypeScript interfaces for all component props
- Destructure props in function signature
- Use optional props sparingly - prefer required props with defaults

## Data Persistence

### LocalStorage
- All data stored in browser LocalStorage
- Abstracted behind `StorageService` interface
- Implementations: `LocalStorageAdapter`
- Handle quota exceeded gracefully
- Serialize/deserialize domain objects properly

### Data Format
- Store as JSON
- Version all stored data for future migrations
- Validate data on load - handle corrupt data gracefully

## Code Quality Checklist

Before committing:
- [ ] All tests pass (`npm run test`)
- [ ] Linting passes (`npm run lint`)
- [ ] All methods ≤8 lines
- [ ] All methods have cognitive complexity ≤4
- [ ] No mocking frameworks used
- [ ] Dependency inversion followed throughout
- [ ] Domain layer has no framework dependencies
- [ ] All domain objects are immutable

## Common Patterns

### Creating Use Cases
```typescript
// Domain interface
export interface CreateContactUseCase {
  execute(data: CreateContactData): Promise<Contact>
}

// Application implementation
export class CreateContact implements CreateContactUseCase {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly checkInScheduler: CheckInScheduler
  ) {}

  async execute(data: CreateContactData): Promise<Contact> {
    const contact = Contact.create(data)
    await this.contactRepository.save(contact)
    await this.checkInScheduler.scheduleInitial(contact)
    return contact
  }
}
```

### Creating Test Doubles
```typescript
// Test implementation of repository
export class InMemoryContactRepository implements ContactRepository {
  private contacts: Map<ContactId, Contact> = new Map()

  async save(contact: Contact): Promise<void> {
    this.contacts.set(contact.id, contact)
  }

  async findById(id: ContactId): Promise<Contact | null> {
    return this.contacts.get(id) ?? null
  }
}
```

### Dependency Injection in React
```typescript
// Create context
const DependencyContext = createContext<Dependencies | null>(null)

// Use in components
export function useContacts() {
  const deps = useContext(DependencyContext)
  if (!deps) throw new Error('Dependencies not provided')
  return deps.createContactUseCase
}
```

## Important Reminders

1. **Test first, always** - No production code without a failing test
2. **8 lines maximum** - Extract helper methods when approaching limit
3. **No mocking frameworks** - Create simple in-memory test implementations
4. **Immutability** - All domain objects are immutable
5. **Interfaces everywhere** - Abstract all dependencies behind interfaces
6. **Domain purity** - Domain layer knows nothing about React, LocalStorage, or browser