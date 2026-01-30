# Architecture Documentation

This document describes the architectural decisions, patterns, and principles used in the Contact Check-in Application.

## Table of Contents

1. [Architectural Overview](#architectural-overview)
2. [Clean Architecture Layers](#clean-architecture-layers)
3. [Design Patterns](#design-patterns)
4. [Domain Model](#domain-model)
5. [Application Services](#application-services)
6. [Infrastructure](#infrastructure)
7. [UI Layer](#ui-layer)
8. [Dependency Injection](#dependency-injection)
9. [Testing Strategy](#testing-strategy)
10. [Key Architectural Decisions](#key-architectural-decisions)
11. [Code Quality Constraints](#code-quality-constraints)

---

## Architectural Overview

### Clean Architecture (Hexagonal/Ports & Adapters)

The application follows **Clean Architecture** principles with strict dependency inversion:

```
┌─────────────────────────────────────────────────────────┐
│                      UI Layer (React)                   │
│   Components │ Pages │ Hooks │ Router │ Material-UI    │
└────────────────────────┬────────────────────────────────┘
                         │ depends on
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                   │
│  LocalStorage │ Notifications │ Scheduler │ Export      │
└────────────────────────┬────────────────────────────────┘
                         │ implements
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│    Use Cases │ Repository Interfaces │ Error Hierarchy  │
└────────────────────────┬────────────────────────────────┘
                         │ orchestrates
                         ↓
┌─────────────────────────────────────────────────────────┐
│                     Domain Layer                         │
│   Entities │ Value Objects │ Domain Services │ Pure TS  │
└─────────────────────────────────────────────────────────┘
```

**Dependency Flow**: Always inward toward the domain
- UI depends on Infrastructure and Application
- Infrastructure depends on Application
- Application depends on Domain
- Domain has zero external dependencies

### Core Principles

1. **Separation of Concerns**: Each layer has a clear, distinct responsibility
2. **Dependency Inversion**: High-level modules don't depend on low-level modules
3. **Interface Segregation**: Clients depend only on the interfaces they use
4. **Single Responsibility**: Each class/function has one reason to change
5. **Immutability**: Domain objects are immutable to prevent side effects
6. **Test-Driven Development**: Tests drive the design and implementation

---

## Clean Architecture Layers

### 1. Domain Layer (Core)

**Location**: `src/domain/`

**Purpose**: Pure business logic with no external dependencies

**Characteristics**:
- No dependencies on React, browser APIs, or external libraries
- All objects are immutable (`Object.freeze()`)
- Contains the "heart" of the business logic
- Can be extracted and used in any JavaScript environment

**Contents**:
- **Value Objects**: Immutable, validated primitives
  - `ContactId`, `CategoryId`, `CheckInId` (UUID wrappers)
  - `PhoneNumber` (E.164 validation)
  - `EmailAddress` (RFC 5322 validation)
  - `Location` (with timezone support)
  - `CheckInFrequency` (days/weeks/months/years)

- **Entities**: Domain objects with identity
  - `Contact` - Person to check in with
  - `Category` - Relationship type with frequency
  - `CheckIn` - Scheduled or completed check-in

- **Collections**: Type-safe array wrappers
  - `ContactCollection`, `CategoryCollection`, `CheckInCollection`
  - Provide domain-specific query methods

- **Domain Services**: Cross-entity business logic
  - `DateCalculator` - Calculate next check-in dates
  - `OverdueDetector` - Identify overdue check-ins

- **Repository Interfaces**: Abstract data persistence
  - `IContactRepository`, `ICategoryRepository`, `ICheckInRepository`

**Example**: Contact Value Object
```typescript
export class ContactId extends UuidValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value?: string): ContactId {
    return new ContactId(value || crypto.randomUUID());
  }

  // Immutable, validated, branded type
}
```

### 2. Application Layer

**Location**: `src/application/`

**Purpose**: Orchestrate domain objects to fulfill use cases

**Characteristics**:
- Coordinates domain objects and services
- Defines repository interfaces (ports)
- No UI concerns (no React, no HTTP)
- Can be tested independently of infrastructure

**Contents**:
- **Use Cases**: One class per business operation
  - Contact: `CreateContact`, `UpdateContact`, `DeleteContact`, `SearchContacts`
  - Category: `CreateCategory`, `AssignContactToCategory`
  - Check-in: `CompleteCheckIn`, `RescheduleCheckIn`, `CreateManualCheckIn`
  - Dashboard: `GetDashboardSummary`, `GetTodayCheckIns`

- **Error Hierarchy**: Errors for UI consumption
  - `ApplicationError` - Base error with code and context
  - `ValidationError` - Field-specific validation errors
  - `DomainError` - Domain rule violations

**Example**: Use Case
```typescript
export class CompleteCheckIn {
  constructor(
    private checkInRepository: ICheckInRepository,
    private dateCalculator: DateCalculator
  ) {}

  public async execute(
    checkInId: CheckInId,
    notes?: string
  ): Promise<CheckIn> {
    const checkIn = await this.checkInRepository.findById(checkInId);
    if (!checkIn) throw new DomainError('Check-in not found');

    const completed = checkIn.complete(new Date(), notes);
    await this.checkInRepository.save(completed);

    // Schedule next check-in from original date
    const nextDate = this.dateCalculator.calculateNext(
      completed.scheduledDate,
      completed.frequency
    );
    const nextCheckIn = CheckIn.create(/* ... */);
    await this.checkInRepository.save(nextCheckIn);

    return completed;
  }
}
```

### 3. Infrastructure Layer

**Location**: `src/infrastructure/`

**Purpose**: Implement interfaces defined by application layer

**Characteristics**:
- Contains all external dependencies (browser APIs, LocalStorage)
- Implements repository interfaces
- Adapts external services to domain needs
- Can be swapped without changing domain/application

**Contents**:
- **Storage Abstraction**
  - `StorageService` - Interface for key-value storage
  - `LocalStorageAdapter` - Browser LocalStorage implementation
  - `JsonSerializer` - Serialization/deserialization with validation

- **Repository Implementations**
  - `LocalStorageContactRepository` - Contact persistence
  - `LocalStorageCategoryRepository` - Category persistence
  - `LocalStorageCheckInRepository` - Check-in persistence
  - Query methods: `findById`, `findAll`, `findByDateRange`, `findByStatus`

- **Notification Services**
  - `NotificationService` - Interface for notifications
  - `BrowserNotificationService` - Browser Notification API
  - `EmailSimulator` - Console-based email simulation (MVP)

- **Scheduler Services**
  - `SchedulerService` - Interface for background tasks
  - `IntervalScheduler` - setInterval-based scheduler
  - `OverdueCheckInDetector` - Detects and notifies overdue check-ins

- **Export/Import Services**
  - `JsonExporter` - Export all data to JSON
  - `CsvExporter` - Export contacts to CSV
  - `JsonImporter` - Import with validation

- **Backup Services**
  - `AutomaticBackupService` - Create timestamped backups
  - `BrowserDownloadService` - Trigger browser downloads

- **Migration Services**
  - `MigrationManager` - Version-based schema migrations

**Example**: Repository Implementation
```typescript
export class LocalStorageContactRepository implements IContactRepository {
  constructor(
    private storage: StorageService,
    private serializer: JsonSerializer
  ) {}

  async save(contact: Contact): Promise<void> {
    const all = await this.findAll();
    const existing = all.findIndex(c => c.id.equals(contact.id));

    if (existing >= 0) {
      all[existing] = contact;
    } else {
      all.push(contact);
    }

    const serialized = all.map(c => this.serializer.serialize(c));
    await this.storage.set('contacts', JSON.stringify(serialized));
  }

  async findById(id: ContactId): Promise<Contact | null> {
    const all = await this.findAll();
    return all.find(c => c.id.equals(id)) || null;
  }

  // ... other methods
}
```

### 4. UI Layer

**Location**: `src/ui/`

**Purpose**: Present information and handle user interactions

**Characteristics**:
- React components and hooks
- Material-UI for styling
- No business logic (delegated to application layer via hooks)
- Responsive, mobile-first design

**Contents**:
- **Custom Hooks** (Smart layer)
  - `useContacts` - Contact CRUD with state management
  - `useCategories` - Category CRUD with state management
  - `useCheckIns` - Check-in operations with state management
  - `useDashboard` - Dashboard data aggregation
  - `useAppInitialization` - First-run setup
  - `useNotifications` - Browser notification management
  - `useBackgroundScheduler` - Scheduler lifecycle

- **Components** (Dumb layer)
  - `ContactCard`, `ContactFormModal`, `ContactDetailModal`
  - `CategoryCard`, `CategoryFormModal`, `FrequencySelector`
  - `CheckInCard`, `CreateCheckInModal`, `CompleteCheckInModal`
  - `DashboardStats`, `OverdueCheckIns`, `UpcomingCheckIns`
  - `NavigationBar`, `AppLayout`, `ResponsiveContainer`

- **Pages**
  - `DashboardPage` - Overview of check-ins
  - `ContactListPage` - Browse and manage contacts
  - `CategoryListPage` - Manage categories
  - `CheckInsPage` - Browse all check-ins
  - `SettingsPage` - Configure app and manage data

- **Validation Helpers**
  - `validatePhoneInput`, `validateEmailInput`, `validateLocationInput`
  - Non-throwing validation for real-time feedback
  - Returns `{valid: boolean, error?: string}`

**Example**: Smart Hook
```typescript
export function useContacts() {
  const deps = useDependencies();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch on mount
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const result = await deps.listAllContacts.execute();
      setContacts(result);
      setError(null);
    } catch (err) {
      setError('Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const createContact = async (data: ContactData) => {
    const contact = Contact.create(/* map data */);
    await deps.createContact.execute(contact);
    await loadContacts(); // Refresh
  };

  return { contacts, isLoading, error, createContact, /* ... */ };
}
```

**Example**: Dumb Component
```typescript
interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{contact.name.value}</Typography>
        <Typography>{contact.email.value}</Typography>
        <Typography>{contact.phone.value}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => onEdit(contact)}>Edit</Button>
        <Button onClick={() => onDelete(contact)}>Delete</Button>
      </CardActions>
    </Card>
  );
}
```

---

## Design Patterns

### Value Object Pattern

**Purpose**: Encapsulate validation and provide type safety

**Implementation**:
- Immutable objects (`Object.freeze()`)
- Validation in factory methods
- Branded types to prevent primitive obsession
- Equality based on value, not reference

**Example**:
```typescript
export class PhoneNumber {
  private readonly _brand: 'PhoneNumber' = 'PhoneNumber';

  private constructor(public readonly value: string) {
    Object.freeze(this);
  }

  public static create(value: string): PhoneNumber {
    if (!value.match(/^\+[1-9]\d{10,14}$/)) {
      throw new DomainError('Invalid phone number');
    }
    return new PhoneNumber(value);
  }

  public equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }
}
```

### Entity Pattern

**Purpose**: Represent domain objects with identity

**Implementation**:
- Have a unique identifier (ContactId, CategoryId, CheckInId)
- Equality based on ID, not value
- Immutable - updates return new instances
- Encapsulate business rules

**Example**:
```typescript
export class Contact {
  private constructor(
    public readonly id: ContactId,
    public readonly name: ContactName,
    public readonly email: EmailAddress,
    // ... other fields
  ) {
    Object.freeze(this);
  }

  public static create(/* params */): Contact {
    return new Contact(/* ... */);
  }

  public updateEmail(newEmail: EmailAddress): Contact {
    return new Contact(
      this.id,
      this.name,
      newEmail, // changed
      // ... copy other fields
    );
  }

  public equals(other: Contact): boolean {
    return this.id.equals(other.id);
  }
}
```

### Repository Pattern

**Purpose**: Abstract data persistence behind an interface

**Implementation**:
- Interface defined in application layer
- Implementation in infrastructure layer
- Hides storage mechanism from business logic
- Supports in-memory test doubles

**Example**:
```typescript
// Application layer (interface)
export interface IContactRepository {
  save(contact: Contact): Promise<void>;
  findById(id: ContactId): Promise<Contact | null>;
  findAll(): Promise<Contact[]>;
  delete(id: ContactId): Promise<void>;
}

// Infrastructure layer (implementation)
export class LocalStorageContactRepository implements IContactRepository {
  // ... implementation using LocalStorage
}

// Test layer (test double)
export class InMemoryContactRepository implements IContactRepository {
  private contacts: Map<string, Contact> = new Map();
  // ... simple in-memory implementation
}
```

### Collection Pattern

**Purpose**: Type-safe array wrappers with domain operations

**Implementation**:
- Wrap arrays with domain-specific methods
- Enforce type safety
- Provide query methods
- Immutable operations return new collections

**Example**:
```typescript
export class ContactCollection extends BaseCollection<Contact> {
  public findByCategory(categoryId: CategoryId): ContactCollection {
    const filtered = this.items.filter(c =>
      c.categoryId.equals(categoryId)
    );
    return new ContactCollection(filtered);
  }

  public sortByName(): ContactCollection {
    const sorted = [...this.items].sort((a, b) =>
      a.name.value.localeCompare(b.name.value)
    );
    return new ContactCollection(sorted);
  }
}
```

### Factory Pattern

**Purpose**: Create complex domain objects with validation

**Implementation**:
- Static factory methods on domain classes
- Encapsulate validation logic
- Hide construction details
- Provide default values

**Example**:
```typescript
export class CheckIn {
  public static create(
    contactId: ContactId,
    categoryId: CategoryId,
    scheduledDate: Date,
    frequency: CheckInFrequency
  ): CheckIn {
    return new CheckIn(
      CheckInId.create(),
      contactId,
      categoryId,
      ScheduledDate.create(scheduledDate),
      CompletionDate.createNull(),
      CheckInNotes.createNull(),
      frequency
    );
  }

  public static createManual(/* different params */): CheckIn {
    // Manual check-ins don't have frequency
    return new CheckIn(/* ... */);
  }
}
```

### Null Object Pattern

**Purpose**: Avoid null checks with polymorphic null objects

**Implementation**:
- Null objects implement the same interface
- Provide safe default behavior
- Eliminate null checks throughout code

**Example**:
```typescript
export class CompletionDate {
  private constructor(
    public readonly value: Date | null,
    public readonly isNull: boolean
  ) {
    Object.freeze(this);
  }

  public static create(value: Date): CompletionDate {
    return new CompletionDate(value, false);
  }

  public static createNull(): CompletionDate {
    return new CompletionDate(null, true);
  }

  public format(): string {
    return this.isNull ? 'Not completed' : format(this.value!, 'PPP');
  }
}
```

### Strategy Pattern

**Purpose**: Pluggable algorithms for notifications

**Implementation**:
- `NotificationService` interface
- Multiple implementations: `BrowserNotificationService`, `EmailSimulator`
- Easy to add new notification channels

**Example**:
```typescript
export interface NotificationService {
  requestPermission(): Promise<NotificationPermission>;
  notify(title: string, body: string): Promise<void>;
}

// Strategy 1: Browser notifications
export class BrowserNotificationService implements NotificationService {
  async notify(title: string, body: string): Promise<void> {
    new Notification(title, { body });
  }
}

// Strategy 2: Email notifications (future)
export class EmailNotificationService implements NotificationService {
  async notify(title: string, body: string): Promise<void> {
    // Send email via backend
  }
}
```

### Dependency Injection Pattern

**Purpose**: Provide dependencies without tight coupling

**Implementation**:
- `DIContainer` manages object graph
- React Context provides container to components
- `useDependencies` hook accesses dependencies
- Constructor injection for all dependencies

**Example**:
```typescript
// Container setup
export class DIContainer {
  private contactRepository: IContactRepository;
  private createContact: CreateContact;

  constructor() {
    this.contactRepository = new LocalStorageContactRepository(/*...*/);
    this.createContact = new CreateContact(this.contactRepository);
  }

  public getCreateContact(): CreateContact {
    return this.createContact;
  }
}

// React integration
const DependencyContext = createContext<DIContainer | null>(null);

export function useDependencies(): DIContainer {
  const deps = useContext(DependencyContext);
  if (!deps) throw new Error('Dependencies not provided');
  return deps;
}

// Usage in components
function MyComponent() {
  const deps = useDependencies();
  const createContact = deps.getCreateContact();
  // ...
}
```

---

## Domain Model

### Contact Aggregate

**Root Entity**: `Contact`

**Value Objects**:
- `ContactId` - UUID identifier
- `ContactName` - Name with validation
- `PhoneNumber` - E.164 phone validation
- `EmailAddress` - RFC 5322 email validation
- `Location` - City, country, timezone
- `RelationshipContext` - How you know them
- `ImportantDate` - Birthday, anniversary, etc.

**Collections**:
- `ContactCollection` - Query contacts by category, name, etc.
- `ImportantDateCollection` - Manage multiple important dates

**Invariants**:
- Contact must have valid name, email, phone
- Email must be unique across all contacts
- Phone must be E.164 format
- Location must include timezone

### Category Aggregate

**Root Entity**: `Category`

**Value Objects**:
- `CategoryId` - UUID identifier
- `CategoryName` - Category name with validation
- `CheckInFrequency` - Frequency with unit (days/weeks/months/years)

**Collections**:
- `CategoryCollection` - Query categories

**Invariants**:
- Category name must be unique
- Frequency must be positive
- Category cannot be deleted if it has contacts

### CheckIn Aggregate

**Root Entity**: `CheckIn`

**Value Objects**:
- `CheckInId` - UUID identifier
- `ScheduledDate` - When check-in is due
- `CompletionDate` - When check-in was completed (null object)
- `CheckInNotes` - Notes about the check-in (null object)

**Enums**:
- `CheckInStatus` - Scheduled, Completed, Overdue

**Collections**:
- `CheckInCollection` - Query by status, date range, contact

**Invariants**:
- Scheduled date cannot be in the past (when creating)
- Completed check-ins must have completion date
- Manual check-ins don't schedule next check-in

### Domain Services

**DateCalculator**:
- Calculates next check-in date from original scheduled date
- Handles frequency units (days/weeks/months/years)
- Pure function with no side effects

**OverdueDetector**:
- Identifies check-ins past their scheduled date
- Filters check-ins by overdue status
- Sorts by how long overdue

---

## Application Services

### Use Case Pattern

Each use case:
- Has single, clear purpose
- Takes dependencies via constructor
- Has one public `execute()` method
- Returns domain objects or throws domain errors
- Is easily testable with test doubles

### Use Cases by Domain

**Contact Use Cases** (6):
1. `CreateContact` - Add new contact, schedule initial check-in
2. `UpdateContact` - Modify contact details
3. `GetContactById` - Retrieve single contact
4. `ListAllContacts` - Retrieve all contacts
5. `DeleteContact` - Remove contact and all check-ins
6. `SearchContacts` - Find contacts by name/email/phone

**Category Use Cases** (6):
1. `CreateCategory` - Add new category
2. `UpdateCategory` - Modify category name or frequency
3. `DeleteCategory` - Remove category (if no contacts)
4. `ListCategories` - Retrieve all categories
5. `GetDefaultCategories` - Get predefined categories
6. `AssignContactToCategory` - Change contact's category

**Check-in Use Cases** (7):
1. `ScheduleInitialCheckIn` - Schedule first check-in for new contact
2. `CreateManualCheckIn` - Create ad-hoc check-in
3. `GetUpcomingCheckIns` - Get check-ins in next 7/30 days
4. `GetOverdueCheckIns` - Get past-due check-ins
5. `CompleteCheckIn` - Mark complete, schedule next
6. `RescheduleCheckIn` - Move to new date
7. `GetCheckInHistory` - Get completed check-ins for contact

**Dashboard Use Cases** (2):
1. `GetDashboardSummary` - Aggregate stats (overdue, today, upcoming, total)
2. `GetTodayCheckIns` - Get check-ins due today

### Error Hierarchy

**ApplicationError** (base):
- `code: string` - Machine-readable error code
- `message: string` - Human-readable message
- `context?: Record<string, unknown>` - Additional context

**ValidationError** (extends ApplicationError):
- `field: string` - Field that failed validation
- `value: unknown` - Invalid value
- Used for form validation

**DomainError** (extends ApplicationError):
- Used for domain rule violations
- Examples: "Cannot delete category with contacts", "Check-in not found"

**Type Guards**:
```typescript
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isApplicationError(error: unknown): error is ApplicationError {
  return error instanceof ApplicationError;
}
```

---

## Infrastructure

### LocalStorage Strategy

**Why LocalStorage?**
- No backend required (reduce complexity/cost)
- Offline-first by default
- Data stays private on user's device
- Fast reads/writes
- Perfect for MVP with <500 contacts

**Limitations**:
- 5-10MB storage limit (varies by browser)
- No synchronization between devices
- Data lost if browser storage cleared
- No concurrent user support

**Mitigation**:
- Export/import functionality for backups
- Data validation on load
- Graceful handling of quota exceeded
- Encourage regular backups

### Storage Abstraction

**StorageService Interface**:
```typescript
export interface StorageService {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

**Benefits**:
- Easy to swap implementations (LocalStorage → IndexedDB → Backend)
- Testable with in-memory implementation
- Consistent error handling

### Serialization Strategy

**JsonSerializer**:
- Converts domain objects to/from JSON
- Validates structure on deserialization
- Throws descriptive errors for invalid data
- Supports versioning for migrations

**Example**:
```typescript
export class JsonSerializer {
  public serialize<T>(obj: T): Record<string, unknown> {
    // Convert domain object to plain JSON
  }

  public deserialize<T>(
    json: Record<string, unknown>,
    factory: (data: unknown) => T
  ): T {
    // Validate and reconstruct domain object
  }
}
```

### Background Scheduler

**IntervalScheduler**:
- Runs tasks at fixed intervals (6 hours)
- Starts on app initialization
- Stops on app unmount
- Uses browser `setInterval`

**OverdueCheckInDetector**:
- Identifies overdue check-ins
- Sends notifications for each
- Tracks "last notified" to avoid spam
- Runs on app startup and every 6 hours

---

## UI Layer

### Component Architecture

**Smart Components (Hooks)**:
- Contain state and side effects
- Call use cases via DI container
- Handle loading/error states
- Auto-refresh after mutations

**Dumb Components**:
- Pure presentation
- Receive data via props
- Emit events via callbacks
- No side effects or state management

### State Management

**Local State (useState)**:
- UI state (modals open/closed)
- Form input values
- Temporary selections

**Custom Hooks (useEffect + useState)**:
- Fetch data from use cases
- Manage loading/error states
- Provide operations (CRUD)
- Auto-refresh on mount

**No Global State Library**:
- Dependency injection via React Context
- State kept close to where it's used
- Lift state only when necessary

### Responsive Design

**Mobile-First**:
- Default styles for mobile
- Media queries for larger screens
- Material-UI breakpoints: `xs`, `sm`, `md`, `lg`, `xl`

**Navigation**:
- Desktop: Full text labels
- Mobile: Icon-only buttons
- Drawer menu (future enhancement)

**Components**:
- `ResponsiveContainer` - Max width with centered content
- Cards stack on mobile, grid on desktop
- Modals full-screen on mobile

---

## Dependency Injection

### DIContainer

**Singleton Pattern**:
- One container instance per app
- Shared repositories/services
- Lazy initialization

**Dependency Graph**:
```
DIContainer
├── Storage
│   ├── LocalStorageAdapter
│   └── JsonSerializer
├── Repositories
│   ├── LocalStorageContactRepository
│   ├── LocalStorageCategoryRepository
│   └── LocalStorageCheckInRepository
├── Services
│   ├── BrowserNotificationService
│   ├── EmailSimulator
│   ├── IntervalScheduler
│   ├── OverdueCheckInDetector
│   ├── AutomaticBackupService
│   └── MigrationManager
├── Use Cases (23 total)
│   ├── CreateContact
│   ├── UpdateContact
│   └── ...
└── Lifecycle Methods
    ├── start() - Initialize scheduler
    └── stop() - Clean up resources
```

### React Integration

**DependencyProvider**:
- Wraps entire app
- Creates DIContainer
- Provides via React Context
- Handles container lifecycle (start/stop)

**useDependencies Hook**:
- Accesses container from context
- Throws if used outside provider
- Type-safe access to all dependencies

---

## Testing Strategy

### Test Pyramid

```
         /\
        /E2E\       3 integration tests
       /------\
      /  Int.  \    50+ component tests
     /----------\
    /   Unit     \  900+ unit tests
   /--------------\
```

**Unit Tests** (900+):
- Domain layer: 100% coverage
- Application layer: 100% coverage
- Infrastructure: High coverage
- Hooks: 97%+ coverage
- Helpers: 100% coverage

**Component Tests** (50+):
- React Testing Library
- User interactions (click, type, submit)
- Loading and error states
- Accessibility (roles, labels)

**Integration Tests** (3):
- End-to-end user flows
- Real DIContainer with LocalStorage
- No mocking
- `ContactFlow`, `CheckInFlow`, `DataIntegrity`

### No Mocking Frameworks

**Why?**
- Tests become brittle and coupled to implementation
- Doesn't catch integration issues
- Forces better interface design
- Makes tests more readable

**Instead, use**:
- **Test Doubles**: In-memory implementations
  - `InMemoryContactRepository`
  - `InMemoryCategoryRepository`
  - `InMemoryCheckInRepository`
- **Fakes**: Simple implementations for testing
  - `FakeNotificationService` (captures calls)
  - `FakeTimerAPI` (controls time)

### TDD Workflow

1. **Red**: Write failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve design while keeping tests green

**Benefits**:
- Design emerges from tests
- High confidence in changes
- Living documentation
- Fast feedback loop

---

## Key Architectural Decisions

### Decision 1: LocalStorage Over Backend

**Context**: Need data persistence for MVP

**Decision**: Use browser LocalStorage

**Rationale**:
- Eliminates backend hosting costs
- Faster development (no API layer)
- True offline-first experience
- Data privacy (stays on user's device)

**Trade-offs**:
- No synchronization between devices
- Limited to ~5-10MB storage
- Data lost if browser cleared

**Alternatives Considered**:
- Backend API (too complex for MVP)
- IndexedDB (overkill for current scale)
- Cloud storage (requires authentication)

### Decision 2: Clean Architecture

**Context**: Need maintainable, testable codebase

**Decision**: Use Clean Architecture (Hexagonal)

**Rationale**:
- Clear separation of concerns
- Easy to test each layer independently
- Can swap implementations (LocalStorage → Backend)
- Domain logic remains pure and portable

**Trade-offs**:
- More upfront code (interfaces, abstractions)
- Steeper learning curve

**Alternatives Considered**:
- MVC (insufficient separation)
- Feature-based folders (harder to maintain boundaries)

### Decision 3: No Mocking Frameworks

**Context**: Need reliable, maintainable tests

**Decision**: Use test doubles (in-memory implementations) instead of mocks

**Rationale**:
- Tests are less brittle
- Catches integration issues
- Forces better interface design
- Tests are more readable

**Trade-offs**:
- More code to write (test double implementations)
- Slightly slower tests

**Alternatives Considered**:
- Jest mocks (too brittle)
- Sinon stubs (couples tests to implementation)

### Decision 4: Immutable Domain Objects

**Context**: Need predictable state management

**Decision**: All domain objects are immutable (`Object.freeze()`)

**Rationale**:
- Prevents accidental mutations
- Makes state changes explicit
- Simplifies debugging
- Enables time-travel debugging (future)

**Trade-offs**:
- More verbose (must create new objects for changes)
- Can't use mutations

**Alternatives Considered**:
- Mutable objects (too error-prone)
- Immer library (adds dependency)

### Decision 5: 8-Line Method Limit

**Context**: Need readable, maintainable code

**Decision**: Maximum 8 lines per method, complexity ≤4

**Rationale**:
- Forces Single Responsibility Principle
- Methods fit on screen without scrolling
- Easier to understand at a glance
- Encourages composition

**Trade-offs**:
- More methods to navigate
- Some simple operations feel over-abstracted

**Alternatives Considered**:
- No limit (leads to complex methods)
- 15-line limit (still too long)

### Decision 6: Material-UI

**Context**: Need professional, responsive UI

**Decision**: Use Material-UI component library

**Rationale**:
- Comprehensive component library
- Built-in accessibility
- Responsive by default
- Customizable theming

**Trade-offs**:
- Large bundle size (~300KB)
- Some learning curve

**Alternatives Considered**:
- Custom CSS (too time-consuming)
- Tailwind (less accessible by default)
- Chakra UI (smaller community)

### Decision 7: React Context for DI

**Context**: Need dependency injection in React

**Decision**: Use React Context + DIContainer

**Rationale**:
- Built-in React feature (no library)
- Type-safe with TypeScript
- Avoids prop drilling
- Supports testing with custom containers

**Trade-offs**:
- Manual wiring in container
- All dependencies re-render on context change (mitigated with separate contexts)

**Alternatives Considered**:
- InversifyJS (too heavyweight)
- Prop drilling (doesn't scale)
- Singleton instances (harder to test)

---

## Code Quality Constraints

### Method Length: ≤8 Lines

**Enforcement**: Manual code review + ESLint plugin (future)

**Counting Rules**:
- Blank lines don't count
- Opening/closing braces don't count
- One statement per line

**Example Refactoring**:
```typescript
// BAD: 12 lines
function processCheckIn(checkIn: CheckIn): void {
  if (checkIn.isComplete()) return;
  if (checkIn.isOverdue()) {
    notifyOverdue(checkIn);
    updateStatus(checkIn, 'overdue');
  } else if (checkIn.isDueToday()) {
    notifyToday(checkIn);
    updateStatus(checkIn, 'today');
  } else {
    updateStatus(checkIn, 'upcoming');
  }
  saveCheckIn(checkIn);
}

// GOOD: 5 lines
function processCheckIn(checkIn: CheckIn): void {
  if (checkIn.isComplete()) return;
  const status = determineStatus(checkIn);
  notifyIfNeeded(checkIn, status);
  updateAndSave(checkIn, status);
}
```

### Cognitive Complexity: ≤4

**Enforcement**: ESLint plugin (eslint-plugin-cognitive-complexity)

**What Increases Complexity**:
- Nested if/else (+1 per level)
- Loops (+1)
- Logical operators (+1)
- Recursion (+1)
- Catch blocks (+1)

**How to Reduce**:
- Extract guard clauses
- Use early returns
- Extract helper methods
- Use polymorphism over conditionals

### Immutability

**Enforcement**: `Object.freeze()` in constructors + ESLint rules

**Rules**:
- All domain objects frozen
- No mutations anywhere
- Use spread operator for updates: `{...obj, field: newValue}`
- Arrays: Use `map`, `filter`, `concat` (not `push`, `splice`)

### Type Safety

**Enforcement**: TypeScript strict mode

**Rules**:
- No explicit `any` types
- All parameters typed
- All return types specified
- Branded types for value objects

---

## Future Considerations

### Service Worker for Offline Support

**When**: Phase 11+ (post-MVP)

**Benefits**:
- True offline functionality
- Background sync when online
- Cache static assets
- Push notifications (even when app closed)

### Backend Integration

**When**: If synchronization needed across devices

**Changes Required**:
- Implement `BackendContactRepository`, etc.
- Add authentication
- Handle conflicts (last-write-wins, CRDT, etc.)
- Add retry logic and optimistic updates

**Architecture unchanged**: Swap implementations, keep domain/application layer

### Progressive Web App (PWA)

**When**: Phase 11+

**Benefits**:
- Install to home screen
- App-like experience
- Splash screen
- Standalone window

**Changes Required**:
- Add `manifest.json`
- Service Worker registration
- Icons and splash screens

### Real-time Notifications

**When**: Backend available

**Options**:
- WebSockets
- Server-Sent Events (SSE)
- Push notifications via service worker

---

## Conclusion

This architecture provides:

✅ **Maintainability**: Clear separation of concerns
✅ **Testability**: 100% coverage of core logic
✅ **Flexibility**: Easy to swap implementations
✅ **Scalability**: Can add backend without rewriting core
✅ **Type Safety**: Compile-time guarantees
✅ **Simplicity**: Each part has one clear purpose

The architecture follows battle-tested patterns (Clean Architecture, DDD, Repository, DI) adapted for a frontend-only application. All trade-offs are explicit and documented.

**Core Philosophy**: Complexity should be in the domain, not the architecture. The architecture exists to make the domain clear, testable, and flexible.
