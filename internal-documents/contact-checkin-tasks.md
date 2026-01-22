# Contact Check-in Application - Development Checklist
## React + TypeScript (Vite) with Local Storage

**Last Updated:** 2026-01-22
**Current Phase:** Phase 4 - IN PROGRESS (1/4 subsections complete)
**Test Status:** ✅ 508 tests passing across 54 test files
**Code Quality:** All code follows TDD with 8-line method limit and complexity ≤4

## Project Overview
A single-page web application to track personal contacts and schedule regular check-in calls using React + TypeScript with Vite, following XP/TDD principles with strict OO design patterns.

## Current Implementation Status Summary
- ✅ **Phase 1:** Project Setup & Infrastructure - COMPLETE
- ✅ **Phase 2:** Domain Model - COMPLETE (4/4 subsections)
  - ✅ Contact Domain (100%) - 9 value objects + Contact entity + collections + NullContact
  - ✅ Category Domain (100%) - 3 value objects + Category entity + collections
  - ✅ Check-in Domain (100%) - 5 value objects + CheckIn entity + CheckInStatus enum + CheckInCollection + repository interface
  - ✅ Domain Services (100%) - DateCalculator + OverdueDetector
- ✅ **Phase 3:** Application Services - COMPLETE (22/22 use cases)
  - ✅ Contact Use Cases (100% - 6/6 complete: CreateContact, UpdateContact, GetContactById, ListAllContacts, DeleteContact, SearchContacts)
  - ✅ Category Use Cases (100% - 6/6 complete: CreateCategory, UpdateCategory, DeleteCategory, ListCategories, GetDefaultCategories, AssignContactToCategory)
  - ✅ Check-in Use Cases (100% - 6/6 complete: ScheduleInitialCheckIn, GetUpcomingCheckIns, GetOverdueCheckIns, CompleteCheckIn, RescheduleCheckIn, GetCheckInHistory)
  - ✅ Dashboard Use Cases (100% - 4/4 complete: GetDashboardSummary, GetTodayCheckIns)
- 🔄 **Phase 4:** Infrastructure - IN PROGRESS (1/4 subsections complete)
  - ✅ LocalStorage Abstraction (100% - StorageService interface, LocalStorageAdapter, JsonSerializer with 21 tests)
- ❌ **Phase 5:** Dependency Injection - NOT STARTED (0/2 subsections)
- ❌ **Phase 6:** React UI Layer - NOT STARTED (0/8 subsections)

## Architecture Decision
**Frontend-Only Application with Local Storage**
- React + TypeScript + Vite for UI
- Local Storage API for data persistence
- Browser-based scheduling and notifications
- No backend server required (runs entirely in browser)

## Claude Code Configuration

### MCP Servers to Enable
- **Filesystem MCP**: For reading/writing project files
- **Git MCP**: For version control operations

## Phase 1: Project Setup & Infrastructure ✅ COMPLETE

### 1.1 Initialize Vite Project ✅
- [x] Run `npm create vite@latest contact-checkin-app -- --template react-ts`
- [x] Navigate to project: `cd contact-checkin-app`
- [x] Install dependencies: `npm install`
- [x] Verify build works: `npm run dev`

### 1.2 Install Additional Dependencies ✅
- [x] Install testing: `npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`
- [x] Install date library: `npm install date-fns`
- [x] Install UUID generator: `npm install uuid && npm install -D @types/uuid`
- [x] Install routing: `npm install react-router-dom`
- [x] Install UI framework: Material-UI (`@mui/material @emotion/react @emotion/styled @mui/icons-material`)

### 1.3 Configure Testing ✅
- [x] Create `vitest.config.ts` with jsdom environment
- [x] Update `package.json` with test scripts (test, test:ui, test:run, test:coverage)
- [x] Create test setup file for React Testing Library (`src/test/setup.ts`)
- [x] Verify test runner works with sample test (`src/App.test.tsx` passing)

### 1.4 Project Structure ✅
Created complete folder structure:
```
src/
├── domain/              # Pure TypeScript domain models
│   ├── contact/
│   ├── category/
│   └── checkin/
├── application/         # Use cases and services
│   ├── contacts/
│   ├── categories/
│   └── checkins/
├── infrastructure/      # LocalStorage adapters
│   ├── storage/
│   └── notifications/
├── ui/                  # React components
│   ├── components/
│   ├── pages/
│   └── hooks/
├── test/                # Test setup
└── main.tsx
```

### 1.5 Git Setup ✅
- [x] Initialize git: `git init`
- [x] Create `.gitignore` (use Vite default)
- [x] Create initial commit
- [x] Create `.claude/rules.md` with comprehensive development rules

## Phase 2: Domain Model (TDD) ✅ COMPLETE

### 2.1 Contact Domain ✅ COMPLETE
- [x] Test & implement `ContactId` value object (UUID wrapper)
- [x] Test & implement `PhoneNumber` value object with validation
- [x] Test & implement `EmailAddress` value object with validation
- [x] Test & implement `Location` value object with timezone
- [x] Test & implement `RelationshipContext` value object
- [x] Test & implement `ImportantDate` value object
- [x] Test & implement `Contact` entity (immutable)
- [x] Test & implement `ContactRepository` interface
- [x] Test & implement `ContactCollection` and `ImportantDateCollection` (with BaseCollection)
- [x] Test & implement `UuidValueObject` base class (in domain/shared)
- [x] Add equality methods to all value objects and Contact entity
- [x] Document validation strategy in .claude/rules.md
- [x] Create `InMemoryContactRepository` test double

### 2.2 Category Domain ✅ COMPLETE
- [x] Test & implement `CategoryId` value object (UUID wrapper)
- [x] Test & implement `CategoryName` value object with validation
- [x] Test & implement `CheckInFrequency` value object (days/weeks/months)
- [x] Test & implement `Category` entity (immutable)
- [x] Test & implement `CategoryRepository` interface
- [x] Test & implement `CategoryCollection`
- [x] Create default categories factory

### 2.3 Check-in Domain ✅ COMPLETE
- [x] Test & implement `CheckInId` value object (UUID wrapper) ✅
- [x] Test & implement `ScheduledDate` value object with null object pattern ✅
- [x] Test & implement `CompletionDate` value object with null object pattern ✅
- [x] Test & implement `CheckInNotes` value object with null object pattern ✅
- [x] Test & implement `CheckIn` entity (immutable) with null object pattern ✅
- [x] Test & implement `CheckInStatus` enum (Scheduled, Completed, Overdue) ✅
- [x] Test & implement `CheckInCollection` ✅
- [x] Test & implement `CheckInRepository` interface ✅

### 2.4 Domain Services ✅ COMPLETE
- [x] Test & implement `DateCalculator` service (next check-in from original date)
- [x] Test & implement `OverdueDetector` service (identify overdue check-ins)

## Phase 3: Application Services (TDD) - IN PROGRESS

### 3.1 Contact Management Use Cases ✅ COMPLETE
- [x] Test & implement `CreateContact` use case ✅
- [x] Test & implement `UpdateContact` use case ✅
- [x] Test & implement `GetContactById` use case ✅
- [x] Test & implement `ListAllContacts` use case ✅
- [x] Test & implement `DeleteContact` use case ✅
- [x] Test & implement `SearchContacts` use case ✅

### 3.2 Category Management Use Cases ✅ COMPLETE
- [x] Test & implement `CreateCategory` use case ✅
- [x] Test & implement `UpdateCategory` use case ✅
- [x] Test & implement `DeleteCategory` use case ✅
- [x] Test & implement `ListCategories` use case ✅
- [x] Test & implement `GetDefaultCategories` use case ✅
- [x] Test & implement `AssignContactToCategory` use case ✅

### 3.3 Check-in Management Use Cases ✅ COMPLETE
- [x] Test & implement `ScheduleInitialCheckIn` use case ✅
- [x] Test & implement `GetUpcomingCheckIns` use case (next 7/30 days) ✅
- [x] Test & implement `GetOverdueCheckIns` use case ✅
- [x] Test & implement `CompleteCheckIn` use case (with notes, schedules next from original) ✅
- [x] Test & implement `RescheduleCheckIn` use case ✅
- [x] Test & implement `GetCheckInHistory` use case (for a contact) ✅

### 3.4 Dashboard Use Cases ✅ COMPLETE
- [x] Test & implement `GetDashboardSummary` use case ✅
    - [x] Count of overdue check-ins ✅
    - [x] Count of upcoming check-ins (next 7 days) ✅
    - [x] Total contacts ✅
    - [x] Contacts by category ✅
- [x] Test & implement `GetTodayCheckIns` use case ✅

## Phase 4: Infrastructure Implementation (TDD)

### 4.1 LocalStorage Abstraction ✅
- [x] Test & implement `StorageService` interface
- [x] Test & implement `LocalStorageAdapter` implementation (10 tests passing)
- [x] Test & implement serialization/deserialization helpers (`JsonSerializer` with 11 tests passing)
- [x] Test & implement error handling for storage quota exceeded (`StorageQuotaExceededError`)

### 4.2 Repository Implementations
- [ ] Test & implement `LocalStorageContactRepository`
    - [ ] CRUD operations
    - [ ] Search functionality
    - [ ] Data validation on load
- [ ] Test & implement `LocalStorageCategoryRepository`
    - [ ] CRUD operations
    - [ ] Initialize with defaults if empty
- [ ] Test & implement `LocalStorageCheckInRepository`
    - [ ] CRUD operations
    - [ ] Query by date ranges
    - [ ] Query by status
    - [ ] Query by contact

### 4.3 Browser Notification Service
- [ ] Test & implement `NotificationService` interface
- [ ] Test & implement `BrowserNotificationService` implementation
    - [ ] Request permission
    - [ ] Show notification
    - [ ] Handle permission denied
- [ ] Test & implement `EmailSimulator` (console.log for MVP, no real email)

### 4.4 Background Scheduler
- [ ] Test & implement `SchedulerService` interface
- [ ] Test & implement `IntervalScheduler` (checks every hour while app open)
- [ ] Test & implement notification dispatch logic
- [ ] Test & implement overdue detection on app startup

### 4.5 Data Export/Import
- [ ] Test & implement `ExportService` interface
- [ ] Test & implement `JsonExporter` (download as JSON)
- [ ] Test & implement `CsvExporter` (contacts only)
- [ ] Test & implement `ImportService` interface
- [ ] Test & implement `JsonImporter` with validation

## Phase 5: Dependency Injection Container

### 5.1 DI Setup
- [ ] Create `DIContainer` class
- [ ] Register all repositories
- [ ] Register all use cases
- [ ] Register all services
- [ ] Create factory functions for building object graphs

### 5.2 React Context for DI
- [ ] Create `DependencyContext` React context
- [ ] Create `DependencyProvider` component
- [ ] Create `useDependencies` hook
- [ ] Initialize container in App root

## Phase 6: React UI Layer (TDD where applicable)

### 6.1 Custom Hooks
- [ ] Create `useContacts` hook (wraps use cases)
- [ ] Create `useCategories` hook (wraps use cases)
- [ ] Create `useCheckIns` hook (wraps use cases)
- [ ] Create `useDashboard` hook (wraps use cases)
- [ ] Create `useNotifications` hook (manages browser notifications)

### 6.2 Contact Management UI
- [ ] Create `ContactListPage` component
- [ ] Create `ContactCard` component
- [ ] Create `ContactFormModal` component (create/edit)
- [ ] Create `ContactDetailModal` component
- [ ] Create `ContactSearchBar` component
- [ ] Add form validation with error messages
- [ ] Add loading states
- [ ] Add empty states

### 6.3 Category Management UI
- [ ] Create `CategoryListPage` component
- [ ] Create `CategoryCard` component
- [ ] Create `CategoryFormModal` component (create/edit)
- [ ] Create `FrequencySelector` component (days/weeks/months picker)
- [ ] Create `DefaultCategoriesButton` component
- [ ] Add form validation
- [ ] Add loading and empty states

### 6.4 Dashboard UI
- [ ] Create `DashboardPage` component
- [ ] Create `DashboardStats` component (summary cards)
- [ ] Create `UpcomingCheckIns` component (list next 7 days)
- [ ] Create `OverdueCheckIns` component (urgent attention needed)
- [ ] Create `TodayCheckIns` component
- [ ] Create `CheckInCard` component
- [ ] Add sorting options (by date, contact name)
- [ ] Add filtering options (by category)

### 6.5 Check-in Action UI
- [ ] Create `CompleteCheckInModal` component
    - [ ] Contact info display
    - [ ] Notes textarea
    - [ ] Completion date display
    - [ ] Next scheduled date preview
- [ ] Create `RescheduleCheckInModal` component
    - [ ] Current date display
    - [ ] Date picker for new date
    - [ ] Reason textarea (optional)
- [ ] Create `CheckInHistoryModal` component (per contact)

### 6.6 Settings & Export UI
- [ ] Create `SettingsPage` component
- [ ] Create `NotificationSettings` component
    - [ ] Enable/disable browser notifications
    - [ ] Notification permission request
- [ ] Create `DataExportSection` component
    - [ ] Export as JSON button
    - [ ] Export contacts as CSV button
    - [ ] Download file handling
- [ ] Create `DataImportSection` component
    - [ ] File upload input
    - [ ] Import validation and error display

### 6.7 Navigation & Layout
- [ ] Create `AppLayout` component (main wrapper)
- [ ] Create `NavigationBar` component
    - [ ] Dashboard link
    - [ ] Contacts link
    - [ ] Categories link
    - [ ] Settings link
- [ ] Create `Sidebar` component (optional, for desktop)
- [ ] Set up React Router with routes
- [ ] Create `NotFoundPage` component
- [ ] Add responsive design (mobile-first)

### 6.8 Styling
- [ ] Set up Tailwind CSS or chosen UI framework
- [ ] Create color scheme and design tokens
- [ ] Create reusable button components
- [ ] Create reusable form input components
- [ ] Create reusable modal component
- [ ] Ensure accessibility (ARIA labels, keyboard navigation)

## Phase 7: Notifications & Scheduling

### 7.1 Browser Notifications
- [ ] Implement notification permission flow on first load
- [ ] Show notification for overdue check-ins on app open
- [ ] Show notification for check-ins due today
- [ ] Add notification preferences in settings
- [ ] Handle notification click (navigate to dashboard)

### 7.2 Background Check Service
- [ ] Implement interval-based check (every hour while app open)
- [ ] Check for newly overdue items
- [ ] Dispatch notifications for new overdue items
- [ ] Store "last notified" timestamp to avoid spam

### 7.3 Email Simulation (MVP)
- [ ] Log email "sent" to console with:
    - [ ] Recipient (contact email)
    - [ ] Subject line
    - [ ] Email body
- [ ] Add UI indication that email would be sent
- [ ] Add placeholder for future real email integration

## Phase 8: Data Management

### 8.1 Initial Data Seeding
- [ ] Create seed data script (optional)
- [ ] Implement first-run setup flow
    - [ ] Welcome screen
    - [ ] Create default categories
    - [ ] Optional: import sample contacts

### 8.2 Data Migration
- [ ] Create version number in LocalStorage
- [ ] Implement migration logic for schema changes
- [ ] Add backward compatibility checks

### 8.3 Data Backup
- [ ] Add automatic JSON export on major changes
- [ ] Store backup in browser's downloads
- [ ] Add "restore from backup" feature

## Phase 9: Testing & Quality Assurance

### 9.1 Unit Tests
- [ ] Ensure 100% test coverage for domain layer
- [ ] Ensure 100% test coverage for application layer
- [ ] Ensure high coverage for infrastructure layer
- [ ] Run tests: `npm run test`

### 9.2 Component Tests
- [ ] Test all major components with React Testing Library
- [ ] Test user interactions (click, type, submit)
- [ ] Test loading and error states
- [ ] Test accessibility

### 9.3 Integration Tests
- [ ] Test complete user flows:
    - [ ] Create contact → assign category → view dashboard
    - [ ] Complete check-in → verify next scheduled
    - [ ] Reschedule → verify updated date
    - [ ] Export data → import data → verify integrity

### 9.4 Manual Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test on mobile devices
- [ ] Test offline behavior (Service Worker future enhancement)

### 9.5 Code Quality
- [ ] Run ESLint: `npm run lint`
- [ ] Verify all methods ≤8 lines
- [ ] Verify cognitive complexity ≤4
- [ ] Verify no mocking frameworks used
- [ ] Verify dependency inversion throughout
- [ ] Run Prettier for formatting

## Phase 10: Build & Deployment

### 10.1 Production Build
- [ ] Optimize bundle size with code splitting
- [ ] Run production build: `npm run build`
- [ ] Test production build locally: `npm run preview`
- [ ] Verify LocalStorage works in production build

### 10.2 Deployment Options
Choose one:
- [ ] **Option A: Self-hosted Static**
    - [ ] Copy `dist/` folder to local web server (nginx, Apache)
    - [ ] Access via `http://localhost` or local network IP

- [ ] **Option B: GitHub Pages (Free)**
    - [ ] Create GitHub repository
    - [ ] Configure GitHub Pages deployment
    - [ ] Push code and deploy
    - [ ] Access via `https://username.github.io/contact-checkin-app`

- [ ] **Option C: Netlify/Vercel (Free Tier)**
    - [ ] Connect GitHub repository
    - [ ] Configure build settings
    - [ ] Deploy automatically on push

### 10.3 Documentation
- [ ] Create README.md with:
    - [ ] Project overview
    - [ ] Installation instructions
    - [ ] Development setup
    - [ ] Build and deployment
    - [ ] Architecture overview
- [ ] Create USER_GUIDE.md with:
    - [ ] How to add contacts
    - [ ] How to manage categories
    - [ ] How to handle check-ins
    - [ ] How to export/import data
- [ ] Document architecture decisions in ARCHITECTURE.md

## Phase 11: MVP Launch
- [ ] Deploy to chosen hosting platform
- [ ] Import initial contacts
- [ ] Set up categories
- [ ] Enable browser notifications
- [ ] Use app for one week
- [ ] Collect feedback and issues

---

## Future Enhancements (Post-MVP)

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
- [ ] Mobile-optimized layout

---

## Next Immediate Steps

Based on current progress, the recommended next steps are:

1. **Implement Infrastructure Layer** (Phase 4) ⬅️ PRIORITY
   - LocalStorage repositories for persistence
   - Browser notifications service
   - Background scheduler for overdue detection
   - Data export/import functionality

2. **Implement Dependency Injection Container** (Phase 5)
   - DI container setup
   - React Context for dependency injection
   - Wire up all use cases and repositories

---

## Key Architectural Principles to Maintain

1. **Dependency Flow**: Always inward toward domain
    - Domain (pure TS) → Application → Infrastructure → UI
    - No React/browser APIs in domain/application layers

2. **Interface Segregation**: Small, focused interfaces
    - Each use case has its own interface
    - Repositories expose only needed operations

3. **Test Doubles Over Mocks**: Create simple in-memory implementations
    - `InMemoryContactRepository` for testing
    - `FakeNotificationService` that captures calls

4. **Immutability**: All domain objects immutable
    - Use spread operator for modifications: `{...contact, name: newName}`
    - No mutations in domain layer

5. **Small Methods**: Keep all methods ≤8 lines, complexity ≤4
    - Extract helper functions liberally
    - Single Responsibility Principle

6. **Composition**: Build complex behavior from simple objects
    - Strategy pattern for notification delivery
    - Decorator pattern for adding behavior
    - Higher-order functions for transformations

7. **React Best Practices**:
    - Components only handle presentation
    - Business logic in hooks that wrap use cases
    - No business logic in components
    - Use React Context for DI, not prop drilling
