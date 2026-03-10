# Contact Check-in Application

A single-page web application to track personal contacts and schedule regular check-in calls. Built with React, TypeScript, and Vite following Test-Driven Development (TDD) and Clean Architecture principles.

## Overview

The Contact Check-in Application helps you maintain meaningful relationships by organizing contacts into categories with customizable check-in frequencies. The app schedules reminders, tracks check-in history, and helps ensure you stay connected with the people who matter most.

**Architecture**: Frontend-only application with browser LocalStorage persistence. No backend server required - runs entirely in the browser.

**Status**: Feature-complete with 1042 passing tests across 121 test files.

## Features

- **Contact Management**: Store contact details including phone, email, location, timezone, and relationship context
- **Category Display & Filtering**: View category badges with color coding, filter by category, and group contacts by category
- **Categorization**: Organize contacts by relationship type (Family, Close Friends, Friends, Professional)
- **Smart Scheduling**: Set check-in frequencies per category (daily, weekly, monthly, quarterly, yearly)
- **Check-in Tracking**: Mark check-ins complete with notes, optional schedule next confirmation with date preview
- **Delete Check-ins**: Remove scheduled or overdue check-ins with confirmation dialog
- **Manual Check-ins**: Create ad-hoc check-ins that don't affect regular schedules
- **Dashboard**: View upcoming, overdue, and today's check-ins at a glance
- **Browser Notifications**: Get browser notifications for due and overdue check-ins
- **Background Scheduler**: Automatic detection of overdue check-ins while app is open
- **Data Portability**: Export/import data as JSON or CSV
- **Automatic Backups**: Timestamped JSON backups on major changes
- **First-run Setup**: Automatic seeding of default categories on first launch
- **Data Migration**: Version-based schema migration system
- **Offline-First**: Works entirely in your browser with LocalStorage
- **Responsive Design**: Mobile-first design with icon-only navigation on small screens

## Live Demo

Visit the deployed application: [https://myturnyet.github.io/contact-checkin-app](https://myturnyet.github.io/contact-checkin-app)

## Tech Stack

### Core
- **React 19** - UI framework with hooks
- **TypeScript 5.9** - Type-safe development with strict mode
- **Vite 7** - Lightning-fast build tool and dev server

### UI & Styling
- **Material-UI (MUI) 7** - Component library with custom theme
- **Emotion** - CSS-in-JS styling
- **Material Icons** - Icon library

### Utilities
- **React Router 7** - Client-side routing
- **date-fns 4** - Date manipulation and formatting
- **uuid 13** - Unique identifier generation

### Testing
- **Vitest 4** - Unit test runner with 1018 passing tests
- **React Testing Library** - Component testing
- **jsdom** - DOM simulation for tests

### Code Quality
- **ESLint 9** - Flat config with TypeScript rules
- **TypeScript ESLint** - TypeScript-specific linting

## Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- Modern browser with LocalStorage support

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/myturnyet/contact-checkin-app.git
cd contact-checkin-app
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development server with hot module replacement:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

Create an optimized production build:
```bash
npm run build
```

The build output will be in the `dist/` directory.

Preview the production build locally:
```bash
npm run preview
```

## Testing

### Run Tests

Run tests in watch mode (default):
```bash
npm test
```

Run tests once (CI mode):
```bash
npm run test:run
```

Run tests with interactive UI:
```bash
npm run test:ui
```

Run tests with coverage report:
```bash
npm run test:coverage
```

### Test Status

**Current**: 1042 tests passing across 121 test files
- Domain layer: 100% coverage
- Application layer: 100% coverage
- Infrastructure layer: High coverage
- UI layer: 96%+ statement coverage

### Test Philosophy

This project follows **strict TDD** with:
- Tests written before implementation (Red-Green-Refactor)
- 100% test coverage requirement for domain and application layers
- No mocking frameworks - use in-memory test doubles instead
- Integration tests for critical user flows
- All tests in `__tests__` directories alongside production code

## Code Quality

Run linting:
```bash
npm run lint
```

### Code Standards

- **8-line method limit**: All methods must be ≤8 lines
- **Cognitive complexity ≤4**: Extract helper functions to reduce complexity
- **Immutability**: All domain objects use `Object.freeze()`
- **No explicit `any`**: Strict TypeScript without escape hatches
- **Dependency Inversion**: Always depend on interfaces, not concrete classes
- **Single Responsibility**: Each class/function has one clear purpose

## Project Structure

```
src/
├── domain/                     # Pure TypeScript domain models (no React/browser APIs)
│   ├── contact/                # Contact aggregate
│   │   ├── collections/        # ContactCollection, ImportantDateCollection
│   │   ├── __tests__/          # Domain tests (72 tests)
│   │   ├── Contact.ts          # Contact entity
│   │   ├── ContactId.ts        # UUID value object
│   │   ├── PhoneNumber.ts      # Phone value object with E.164 validation
│   │   ├── EmailAddress.ts     # Email value object with validation
│   │   ├── Location.ts         # Location with timezone support
│   │   └── ...                 # Other value objects
│   ├── category/               # Category aggregate
│   │   ├── collections/        # CategoryCollection
│   │   ├── __tests__/          # Domain tests (30 tests)
│   │   ├── Category.ts         # Category entity
│   │   ├── CategoryId.ts       # UUID value object
│   │   ├── CategoryName.ts     # Name value object
│   │   ├── CheckInFrequency.ts # Frequency value object
│   │   └── ...
│   ├── checkin/                # Check-in aggregate
│   │   ├── collections/        # CheckInCollection
│   │   ├── __tests__/          # Domain tests (42 tests)
│   │   ├── CheckIn.ts          # CheckIn entity
│   │   ├── CheckInId.ts        # UUID value object
│   │   ├── ScheduledDate.ts    # Date value object
│   │   └── ...
│   ├── services/               # Domain services
│   │   ├── DateCalculator.ts  # Calculate next check-in dates
│   │   └── OverdueDetector.ts # Detect overdue check-ins
│   └── shared/                 # Shared domain concepts
│       └── UuidValueObject.ts  # Base class for UUID value objects
├── application/                # Use cases coordinating domain operations
│   ├── contacts/               # Contact use cases (6 use cases, 50 tests)
│   │   ├── CreateContact.ts
│   │   ├── UpdateContact.ts
│   │   ├── GetContactById.ts
│   │   ├── ListAllContacts.ts
│   │   ├── DeleteContact.ts
│   │   └── SearchContacts.ts
│   ├── categories/             # Category use cases (6 use cases, 41 tests)
│   │   ├── CreateCategory.ts
│   │   ├── UpdateCategory.ts
│   │   ├── DeleteCategory.ts
│   │   ├── ListCategories.ts
│   │   ├── GetDefaultCategories.ts
│   │   └── AssignContactToCategory.ts
│   ├── checkins/               # Check-in use cases (8 use cases, 61 tests)
│   │   ├── ScheduleInitialCheckIn.ts
│   │   ├── CreateManualCheckIn.ts
│   │   ├── GetUpcomingCheckIns.ts
│   │   ├── GetOverdueCheckIns.ts
│   │   ├── CompleteCheckIn.ts
│   │   ├── RescheduleCheckIn.ts
│   │   └── GetCheckInHistory.ts
│   │   ├── DeleteCheckIn.ts
│   ├── dashboard/              # Dashboard use cases (2 use cases, 16 tests)
│   │   ├── GetDashboardSummary.ts
│   │   └── GetTodayCheckIns.ts
│   └── shared/
│       └── errors/             # Error hierarchy (21 tests)
│           ├── ApplicationError.ts
│           ├── ValidationError.ts
│           └── DomainError.ts
├── infrastructure/             # Adapters for external concerns
│   ├── storage/                # LocalStorage abstraction (21 tests)
│   │   ├── StorageService.ts   # Storage interface
│   │   ├── LocalStorageAdapter.ts
│   │   └── JsonSerializer.ts
│   ├── repositories/           # Repository implementations (35 tests)
│   │   ├── LocalStorageContactRepository.ts
│   │   ├── LocalStorageCategoryRepository.ts
│   │   └── LocalStorageCheckInRepository.ts
│   ├── notifications/          # Notification services (18 tests)
│   │   ├── NotificationService.ts
│   │   ├── BrowserNotificationService.ts
│   │   └── EmailSimulator.ts
│   ├── scheduler/              # Background scheduling (20 tests)
│   │   ├── SchedulerService.ts
│   │   ├── IntervalScheduler.ts
│   │   └── OverdueCheckInDetector.ts
│   ├── export/                 # Data export services (12 tests)
│   │   ├── JsonExporter.ts
│   │   └── CsvExporter.ts
│   ├── import/                 # Data import services (12 tests)
│   │   └── JsonImporter.ts
│   ├── backup/                 # Automatic backup services (11 tests)
│   │   ├── AutomaticBackupService.ts
│   │   └── BrowserDownloadService.ts
│   └── migration/              # Data migration (8 tests)
│       └── MigrationManager.ts
├── di/                         # Dependency injection
│   ├── DIContainer.ts          # Container with all dependencies (25 tests)
│   └── DependencyContext.tsx   # React Context for DI (5 tests)
├── ui/                         # React components and presentation logic
│   ├── hooks/                  # Custom hooks (54 tests)
│   │   ├── useContacts.ts      # Contact state management
│   │   ├── useCategories.ts    # Category state management
│   │   ├── useCheckIns.ts      # Check-in state management
│   │   ├── useDashboard.ts     # Dashboard state
│   │   ├── useAppInitialization.ts # First-run setup
│   │   ├── useNotifications.ts # Browser notifications
│   │   ├── useBackgroundScheduler.ts # Scheduler lifecycle
│   │   ├── useFirstRun.ts      # First-run detection
│   │   ├── useMigrations.ts    # Data migrations
│   │   └── useBackup.ts        # Backup management
│   ├── helpers/                # Form validation (21 tests)
│   │   └── validation.ts       # Phone/email/location validation
│   ├── components/             # Reusable components (218 tests)
│   │   ├── ContactCard.tsx
│   │   ├── ContactSearchBar.tsx
│   │   ├── ContactFormModal.tsx
│   │   ├── ContactDetailModal.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── CategoryFormModal.tsx
│   │   ├── FrequencySelector.tsx
│   │   ├── CheckInCard.tsx
│   │   ├── CreateCheckInModal.tsx
│   │   ├── CompleteCheckInModal.tsx
│   │   ├── RescheduleCheckInModal.tsx
│   │   ├── CheckInHistoryModal.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── OverdueCheckIns.tsx
│   │   ├── UpcomingCheckIns.tsx
│   │   ├── TodayCheckIns.tsx
│   │   ├── NotificationSettings.tsx
│   │   ├── NotificationPermissionPrompt.tsx
│   │   ├── DataExportSection.tsx
│   │   ├── DataImportSection.tsx
│   │   ├── BackupSection.tsx
│   │   ├── NavigationBar.tsx
│   │   ├── AppLayout.tsx
│   │   ├── ResponsiveContainer.tsx
│   │   ├── WelcomeScreen.tsx
│   │   └── LoadingScreen.tsx
│   ├── pages/                  # Page components (65 tests)
│   │   ├── DashboardPage.tsx
│   │   ├── ContactListPage.tsx
│   │   ├── CategoryListPage.tsx
│   │   ├── CheckInsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── theme/                  # Material-UI theme
│   │   └── theme.ts            # Custom cyan theme with semantic colors
│   └── App.tsx                 # Root component with routing
├── test/                       # Test setup and utilities
│   ├── setup.ts                # Vitest setup with React Testing Library
│   └── doubles/                # Test doubles (in-memory implementations)
│       ├── InMemoryContactRepository.ts
│       ├── InMemoryCategoryRepository.ts
│       └── InMemoryCheckInRepository.ts
└── main.tsx                    # Application entry point
```

## Architecture

### Clean Architecture (Hexagonal/Ports & Adapters)

The application follows **strict dependency inversion** with four layers:

#### 1. Domain Layer (Core)
- Pure TypeScript with no external dependencies
- Value objects with validation and immutability
- Entities representing core business concepts
- Domain services for cross-entity logic
- Repository interfaces (ports)

#### 2. Application Layer
- Use cases coordinating domain operations
- Service interfaces (ports) for external concerns
- Error hierarchy for UI consumption
- No UI or infrastructure dependencies

#### 3. Infrastructure Layer
- LocalStorage repository implementations
- Browser notification service
- Background scheduler with interval checking
- Data export/import services
- Automatic backup service
- Data migration manager

#### 4. UI Layer (React)
- Presentation components (dumb components)
- Custom hooks wrapping use cases (smart hooks)
- React Router for navigation
- Material-UI for styling
- React Context for dependency injection

**Dependency Flow**: Always inward toward domain
```
UI → Infrastructure → Application → Domain
```

### Design Patterns

- **Value Object Pattern**: Immutable, validated primitives (ContactId, PhoneNumber, EmailAddress)
- **Entity Pattern**: Domain objects with identity (Contact, Category, CheckIn)
- **Repository Pattern**: Abstract data persistence behind interfaces
- **Collection Pattern**: Type-safe wrappers around arrays with domain operations
- **Factory Functions**: Create domain objects with validation
- **Strategy Pattern**: Pluggable notification delivery (browser, email)
- **Dependency Injection**: Via DIContainer and React Context
- **Null Object Pattern**: NullContact, NullScheduledDate, NullCompletionDate
- **Service Pattern**: Domain services for cross-entity operations

### Key Architectural Decisions

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

#### LocalStorage vs Backend
**Decision**: Use browser LocalStorage for MVP
**Rationale**:
- Eliminates hosting costs and complexity
- Enables truly offline-first experience
- Faster development iteration
- Data stays private on user's device

#### No Mocking Frameworks
**Decision**: Use in-memory test doubles instead of mocks
**Rationale**:
- Tests are more maintainable and readable
- Catches integration issues between layers
- Forces better interface design
- Reduces test brittleness

#### Immutable Domain Objects
**Decision**: All domain objects are immutable (`Object.freeze()`)
**Rationale**:
- Prevents accidental mutations
- Makes state changes explicit
- Simplifies reasoning about code
- Enables time-travel debugging

#### 8-Line Method Limit
**Decision**: Maximum 8 lines per method
**Rationale**:
- Forces Single Responsibility Principle
- Improves readability and testability
- Makes code easier to understand
- Encourages composition over complexity

## Development Workflow

### Adding a New Feature

1. **Define Domain Types** (if needed)
   - Create value objects with validation
   - Create entities with immutability
   - Keep domain layer pure (no React/browser APIs)

2. **Define Application Interfaces**
   - Create use case interfaces
   - Define service interfaces for external concerns
   - Add error types if needed

3. **Write Tests First** (TDD Red phase)
   - Write failing tests for domain logic
   - Write failing tests for use cases
   - Write failing tests for infrastructure

4. **Implement Minimal Code** (TDD Green phase)
   - Make domain tests pass
   - Make use case tests pass
   - Make infrastructure tests pass

5. **Refactor** (TDD Refactor phase)
   - Extract helper methods to stay under 8 lines
   - Reduce cognitive complexity to ≤4
   - Ensure all objects are immutable

6. **Build UI Components**
   - Create custom hooks wrapping use cases
   - Build presentation components
   - Add loading and error states
   - Test with React Testing Library

7. **Verify Quality**
   - `npm test` - All tests pass
   - `npm run lint` - No lint errors
   - Verify method length ≤8 lines
   - Verify cognitive complexity ≤4

### Code Review Checklist

- [ ] All methods ≤8 lines
- [ ] Cognitive complexity ≤4
- [ ] Tests written before implementation
- [ ] 100% test coverage for new domain/application code
- [ ] No mocking frameworks used
- [ ] Domain objects are immutable
- [ ] Proper dependency flow (inward toward domain)
- [ ] TypeScript strict mode with no `any`
- [ ] Value objects use branded types
- [ ] Interfaces segregated (small, focused)

## Deployment

### GitHub Pages (Current)

The app is deployed to GitHub Pages at: [https://myturnyet.github.io/contact-checkin-app](https://myturnyet.github.io/contact-checkin-app)

Deployment is automated via GitHub Actions on push to `main` branch.

### Manual Deployment

Build and deploy to any static hosting:

```bash
# Build production bundle
npm run build

# Deploy dist/ folder to:
# - GitHub Pages
# - Netlify
# - Vercel
# - Self-hosted web server
```

## User Guide

For end-user documentation, see [USER_GUIDE.md](./USER_GUIDE.md).

## Documentation

- **[USER_GUIDE.md](./USER_GUIDE.md)** - End-user guide for using the app
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architecture documentation
- **[CLAUDE.md](./CLAUDE.md)** - Project context for Claude Code
- **[.claude/rules.md](./.claude/rules.md)** - Development rules and patterns
- **[internal-documents/](./internal-documents/)** - Design documents and task lists

## Development Status

### ✅ Phase 1-9: Complete (1042 tests passing)

- [x] Project setup with Vite, React, TypeScript
- [x] Testing infrastructure with Vitest
- [x] Domain layer (Contact, Category, CheckIn aggregates)
- [x] Application services (24 use cases including DeleteCheckIn)
- [x] Infrastructure (LocalStorage, notifications, scheduler, export/import, backup, migration)
- [x] Dependency injection (DIContainer + React Context)
- [x] React UI layer (10 pages, 30+ components, 10+ hooks)
- [x] Notifications & scheduling
- [x] Data management (seeding, migration, backup)
- [x] Testing & quality assurance (unit, component, integration tests)

### 🚧 Phase 10: Build & Deployment (In Progress)

- [x] GitHub Pages deployment
- [ ] Production build optimization
- [x] Documentation (README, USER_GUIDE, ARCHITECTURE)

### 📋 Phase 11: MVP Launch (Upcoming)

- [ ] Import initial contacts
- [ ] Use app for one week
- [ ] Collect feedback and issues

See [internal-documents/contact-checkin-tasks.md](./internal-documents/contact-checkin-tasks.md) for complete roadmap.

## Future Enhancements

### Advanced Features
- [ ] Service Worker for offline support
- [ ] Real email integration (via backend service)
- [ ] Calendar integration (Google Calendar, iCal)
- [ ] Contact import from CSV/VCF files
- [ ] Advanced search and filtering
- [ ] Tags for contacts (in addition to categories)
- [ ] Reminders X days before check-in
- [ ] Check-in templates (call scripts)
- [ ] Analytics dashboard (check-in frequency, streaks)

### Mobile Enhancements
- [ ] Progressive Web App (PWA) manifest
- [ ] Install prompt for mobile home screen
- [ ] Touch gestures for actions
- [ ] Native mobile app (React Native)

## Contributing

This is a private project. For questions or suggestions, please create an issue.

## License

Private project - All rights reserved

## Acknowledgments

Built with:
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [React](https://react.dev/) - Library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Material-UI](https://mui.com/) - React component library
- [Vitest](https://vitest.dev/) - Blazing fast unit test framework
- [React Testing Library](https://testing-library.com/react) - Simple and complete testing utilities
- [date-fns](https://date-fns.org/) - Modern JavaScript date utility library
- [React Router](https://reactrouter.com/) - Declarative routing for React

---

**Built with Test-Driven Development, Clean Architecture, and ❤️**
