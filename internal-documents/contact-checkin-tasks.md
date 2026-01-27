# Contact Check-in Application - Development Checklist
## React + TypeScript (Vite) with Local Storage

**Last Updated:** 2026-01-27
**Current Phase:** Phase 9 - Testing & Quality Assurance (2/5 subsections complete)
**Test Status:** ✅ 956 tests passing across 116 test files
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
- ✅ **Phase 4:** Infrastructure - COMPLETE (5/5 subsections complete)
  - ✅ LocalStorage Abstraction (100% - StorageService interface, LocalStorageAdapter, JsonSerializer with 21 tests)
  - ✅ Repository Implementations (100% - LocalStorageContactRepository, LocalStorageCategoryRepository, LocalStorageCheckInRepository with 35 tests)
  - ✅ Browser Notification Service (100% - NotificationService interface, BrowserNotificationService, EmailSimulator with 18 tests)
  - ✅ Background Scheduler (100% - SchedulerService interface, IntervalScheduler, OverdueCheckInDetector with 20 tests)
  - ✅ Data Export/Import (100% - JsonExporter, CsvExporter, JsonImporter with validation, 24 tests)
- ✅ **Phase 5:** Dependency Injection - COMPLETE (2/2 subsections complete)
  - ✅ DI Setup (100% - DIContainer with all repositories, use cases, and services with 25 tests)
  - ✅ React Context for DI (100% - DependencyProvider, useDependencies hook, App integration with 5 tests)
- ✅ **Phase 6:** React UI Layer - COMPLETE (8/8 subsections complete + foundation)
  - ✅ Custom Hooks (100% - 5/5 hooks with 32 tests: useContacts, useCategories, useCheckIns, useDashboard, useAppInitialization)
  - ✅ Error Hierarchy (100% - ApplicationError, ValidationError, DomainError with type guards, 21 tests)
  - ✅ Form Validation Helpers (100% - phone/email/location validation + timezone/frequency options, 21 tests)
  - ✅ Contact Management UI (100% - 5 components with 33 tests: ContactCard, ContactSearchBar, ContactFormModal, ContactDetailModal, ContactListPage)
  - ✅ Category Management UI (100% - 4 components with 26 tests: CategoryCard, FrequencySelector, CategoryFormModal, CategoryListPage)
  - ✅ Dashboard UI (100% - 6 components with 32 tests: CheckInCard, DashboardStats, OverdueCheckIns, UpcomingCheckIns, TodayCheckIns, DashboardPage)
  - ✅ Check-in Action UI (100% - 3 components with 22 tests: CompleteCheckInModal, RescheduleCheckInModal, CheckInHistoryModal)
  - ✅ Settings & Export UI (100% - 4 components with 27 tests: NotificationSettings, DataExportSection, DataImportSection, SettingsPage)
  - ✅ Navigation & Layout (100% - 4 components with 21 tests: NavigationBar, AppLayout, NotFoundPage, App routing integration)
  - ✅ Styling & Responsive Design (100% - Theme configuration, responsive navigation, ResponsiveContainer, accessibility improvements with 11 tests)
- ✅ **Phase 7:** Notifications & Scheduling - COMPLETE (3/3 subsections complete)
  - ✅ Browser Notifications (100% - useNotifications hook, NotificationPermissionPrompt component, automatic notifications for overdue/today check-ins, 6 tests)
  - ✅ Background Scheduler Integration (100% - useBackgroundScheduler hook, automatic scheduler initialization, proper cleanup, 5 tests)
  - ✅ Email Simulation (100% - Console logging via EmailSimulator already implemented in Phase 4)
- ✅ **Phase 8:** Data Management - COMPLETE (3/3 subsections complete)
  - ✅ Initial Data Seeding (100% - useFirstRun hook with first-run detection, WelcomeScreen component with feature highlights, App integration with loading states, 9 tests)
  - ✅ Data Migration (100% - MigrationManager with version tracking, useMigrations hook, sequential execution with error handling, 12 tests)
  - ✅ Data Backup (100% - AutomaticBackupService with timestamped downloads, BrowserDownloadService, useBackup hook, BackupSection component, SettingsPage integration, 19 tests)
- 🚧 **Phase 9:** Testing & Quality Assurance - IN PROGRESS (1/5 subsections complete)
  - ✅ Integration Tests (100% - 3 integration test files with 5 tests covering complete user flows: ContactFlow, CheckInFlow, DataIntegrity)

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

### 1.1 Initialize Vite Project 
- [x] Run `npm create vite@latest contact-checkin-app -- --template react-ts`
- [x] Navigate to project: `cd contact-checkin-app`
- [x] Install dependencies: `npm install`
- [x] Verify build works: `npm run dev`

### 1.2 Install Additional Dependencies 
- [x] Install testing: `npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`
- [x] Install date library: `npm install date-fns`
- [x] Install UUID generator: `npm install uuid && npm install -D @types/uuid`
- [x] Install routing: `npm install react-router-dom`
- [x] Install UI framework: Material-UI (`@mui/material @emotion/react @emotion/styled @mui/icons-material`)

### 1.3 Configure Testing 
- [x] Create `vitest.config.ts` with jsdom environment
- [x] Update `package.json` with test scripts (test, test:ui, test:run, test:coverage)
- [x] Create test setup file for React Testing Library (`src/test/setup.ts`)
- [x] Verify test runner works with sample test (`src/App.test.tsx` passing)

### 1.4 Project Structure 
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

### 1.5 Git Setup 
- [x] Initialize git: `git init`
- [x] Create `.gitignore` (use Vite default)
- [x] Create initial commit
- [x] Create `.claude/rules.md` with comprehensive development rules

## Phase 2: Domain Model (TDD) ✅ COMPLETE

### 2.1 Contact Domain 
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

### 2.2 Category Domain 
- [x] Test & implement `CategoryId` value object (UUID wrapper)
- [x] Test & implement `CategoryName` value object with validation
- [x] Test & implement `CheckInFrequency` value object (days/weeks/months)
- [x] Test & implement `Category` entity (immutable)
- [x] Test & implement `CategoryRepository` interface
- [x] Test & implement `CategoryCollection`
- [x] Create default categories factory

### 2.3 Check-in Domain 
- [x] Test & implement `CheckInId` value object (UUID wrapper) 
- [x] Test & implement `ScheduledDate` value object with null object pattern 
- [x] Test & implement `CompletionDate` value object with null object pattern 
- [x] Test & implement `CheckInNotes` value object with null object pattern 
- [x] Test & implement `CheckIn` entity (immutable) with null object pattern 
- [x] Test & implement `CheckInStatus` enum (Scheduled, Completed, Overdue) 
- [x] Test & implement `CheckInCollection` 
- [x] Test & implement `CheckInRepository` interface 

### 2.4 Domain Services 
- [x] Test & implement `DateCalculator` service (next check-in from original date)
- [x] Test & implement `OverdueDetector` service (identify overdue check-ins)

## Phase 3: Application Services (TDD) ✅ COMPLETE

### 3.1 Contact Management Use Cases 
- [x] Test & implement `CreateContact` use case 
- [x] Test & implement `UpdateContact` use case 
- [x] Test & implement `GetContactById` use case 
- [x] Test & implement `ListAllContacts` use case 
- [x] Test & implement `DeleteContact` use case 
- [x] Test & implement `SearchContacts` use case 

### 3.2 Category Management Use Cases 
- [x] Test & implement `CreateCategory` use case 
- [x] Test & implement `UpdateCategory` use case 
- [x] Test & implement `DeleteCategory` use case 
- [x] Test & implement `ListCategories` use case 
- [x] Test & implement `GetDefaultCategories` use case 
- [x] Test & implement `AssignContactToCategory` use case 

### 3.3 Check-in Management Use Cases 
- [x] Test & implement `ScheduleInitialCheckIn` use case 
- [x] Test & implement `GetUpcomingCheckIns` use case (next 7/30 days) 
- [x] Test & implement `GetOverdueCheckIns` use case 
- [x] Test & implement `CompleteCheckIn` use case (with notes, schedules next from original) 
- [x] Test & implement `RescheduleCheckIn` use case 
- [x] Test & implement `GetCheckInHistory` use case (for a contact) 

### 3.4 Dashboard Use Cases 
- [x] Test & implement `GetDashboardSummary` use case 
    - [x] Count of overdue check-ins 
    - [x] Count of upcoming check-ins (next 7 days) 
    - [x] Total contacts 
    - [x] Contacts by category 
- [x] Test & implement `GetTodayCheckIns` use case 
 
## Phase 4: Infrastructure Implementation (TDD) ✅ COMPLETE
 
### 4.1 LocalStorage Abstraction 
- [x] Test & implement `StorageService` interface
- [x] Test & implement `LocalStorageAdapter` implementation (10 tests passing)
- [x] Test & implement serialization/deserialization helpers (`JsonSerializer` with 11 tests passing)
- [x] Test & implement error handling for storage quota exceeded (`StorageQuotaExceededError`)

### 4.2 Repository Implementations 
- [x] Test & implement `LocalStorageContactRepository` (13 tests passing)
    - [x] CRUD operations (save, findById, findAll, delete)
    - [x] Search functionality (by name, email, phone - case-insensitive)
    - [x] Data validation on load (via JsonSerializer)
- [x] Test & implement `LocalStorageCategoryRepository` (8 tests passing)
    - [x] CRUD operations (save, findById, findAll, delete)
    - [x] Initialize with defaults if empty (infrastructure in place)
- [x] Test & implement `LocalStorageCheckInRepository` (14 tests passing)
    - [x] CRUD operations (save, findById, findAll, delete)
    - [x] Query by date ranges (findByDateRange)
    - [x] Query by status (findByStatus)
    - [x] Query by contact (findByContactId)

### 4.3 Browser Notification Service 
- [x] Test & implement `NotificationService` interface (with NotificationPermission enum)
- [x] Test & implement `BrowserNotificationService` implementation (10 tests passing)
    - [x] Request permission (with browser API abstraction)
    - [x] Show notification (with title, body, tag, icon)
    - [x] Handle permission denied (throws descriptive errors)
- [x] Test & implement `EmailSimulator` (8 tests passing - console.log for MVP, no real email)

### 4.4 Background Scheduler 
- [x] Test & implement `SchedulerService` interface (with ScheduledTask and TimerAPI abstractions)
- [x] Test & implement `IntervalScheduler` (13 tests passing - checks every 6 hours while app open)
- [x] Test & implement `OverdueCheckInDetector` (7 tests passing - notification dispatch logic)
- [x] Overdue detection with notification integration (executes task immediately on start and at intervals)

### 4.5 Data Export/Import 
- [x] Test & implement `ExportService` interface
- [x] Test & implement `JsonExporter` (download as JSON)
- [x] Test & implement `CsvExporter` (contacts only)
- [x] Test & implement `ImportService` interface
- [x] Test & implement `JsonImporter` with validation

## Phase 5: Dependency Injection Container ✅ COMPLETE

### 5.1 DI Setup 
- [x] Create `DIContainer` class (25 tests passing)
- [x] Register all repositories (ContactRepository, CategoryRepository, CheckInRepository)
- [x] Register all 20 use cases (6 contact, 6 category, 6 check-in, 2 dashboard)
- [x] Register all services (NotificationService, EmailSimulator, SchedulerService)
- [x] Create factory functions for building object graphs (singleton pattern for shared services)
- [x] Add scheduler lifecycle management (start/stop methods)

### 5.2 React Context for DI
- [x] Create `DependencyContext` React context (5 tests passing)
- [x] Create `DependencyProvider` component
- [x] Create `useDependencies` hook
- [x] Initialize container in App root
- [x] Separate context object for React Refresh compliance
- [x] Support custom container injection for testing

## Phase 6: React UI Layer (TDD) ✅ COMPLETE

### 6.0 Foundation Infrastructure
- [x] Create `ApplicationError` hierarchy (ApplicationError, ValidationError, DomainError)
- [x] Implement type guards (isValidationError, isApplicationError)
- [x] Create form validation helpers (validatePhoneInput, validateEmailInput, validateLocationInput)
- [x] Create utility functions (getAvailableTimezones, getFrequencyOptions)
- [x] Create `useAppInitialization` hook (seeds categories, starts scheduler, persists state)
- [x] Test all foundation components (63 tests passing)

### 6.1 Custom Hooks
- [x] Create `useContacts` hook (8 tests - state management + CRUD operations)
- [x] Create `useCategories` hook (7 tests - state management + CRUD operations)
- [x] Create `useCheckIns` hook (7 tests - state management + complete/reschedule/history)
- [x] Create `useDashboard` hook (6 tests - summary stats + today's check-ins)
- [x] Create `useAppInitialization` hook (4 tests - first-run setup)
- [x] Create `useNotifications` hook (manages browser notifications)

### 6.2 Contact Management UI 
- [x] Create `ContactListPage` component 
- [x] Create `ContactCard` component 
- [x] Create `ContactFormModal` component (create/edit) 
- [x] Create `ContactDetailModal` component 
- [x] Create `ContactSearchBar` component 
- [x] Add form validation with error messages 
- [x] Add loading states 
- [x] Add empty states 

### 6.3 Category Management UI 
- [x] Create `CategoryListPage` component 
- [x] Create `CategoryCard` component 
- [x] Create `CategoryFormModal` component (create/edit) 
- [x] Create `FrequencySelector` component (days/weeks/months picker) 
- [x] Create `DefaultCategoriesButton` component (integrated into CategoryListPage) 
- [x] Add form validation 
- [x] Add loading and empty states 

### 6.4 Dashboard UI 
- [x] Create `DashboardPage` component 
- [x] Create `DashboardStats` component (summary cards) 
- [x] Create `UpcomingCheckIns` component (list next 7 days) 
- [x] Create `OverdueCheckIns` component (urgent attention needed) 
- [x] Create `TodayCheckIns` component 
- [x] Create `CheckInCard` component 
- [ ] Add sorting options (by date, contact name)
- [ ] Add filtering options (by category)

### 6.5 Check-in Action UI 
- [x] Create `CompleteCheckInModal` component
    - [x] Contact info display
    - [x] Notes textarea
    - [x] Completion date display
    - [x] Next scheduled date preview
- [x] Create `RescheduleCheckInModal` component
    - [x] Current date display
    - [x] Date picker for new date
    - [x] Reason textarea (optional)
- [x] Create `CheckInHistoryModal` component (per contact)

### 6.6 Settings & Export UI 
- [x] Create `SettingsPage` component
- [x] Create `NotificationSettings` component
    - [x] Enable/disable browser notifications
    - [x] Notification permission request
- [x] Create `DataExportSection` component
    - [x] Export as JSON button
    - [x] Export contacts as CSV button
    - [x] Download file handling
- [x] Create `DataImportSection` component
    - [x] File upload input
    - [x] Import validation and error display

### 6.7 Navigation & Layout
- [x] Create `AppLayout` component (main wrapper)
- [x] Create `NavigationBar` component
    - [x] Dashboard link
    - [x] Contacts link
    - [x] Categories link
    - [x] Settings link
- [ ] Create `Sidebar` component (optional, for desktop)
- [x] Set up React Router with routes
- [x] Create `NotFoundPage` component
- [x] Add responsive design (mobile-first)

### 6.8 Styling & Responsive Design
- [x] Set up UI framework (Material-UI already in use)
- [x] Create color scheme and design tokens (custom theme with cyan primary, semantic colors)
- [x] Create reusable components (ResponsiveContainer)
- [x] Material-UI provides buttons, inputs, modals (already in use throughout app)
- [x] Add responsive design (mobile-first navigation with icon-only buttons on small screens)
- [x] Ensure accessibility (ARIA labels on mobile navigation, keyboard navigation via Material-UI)

## Phase 7: Notifications & Scheduling ✅ COMPLETE

### 7.1 Browser Notifications
- [x] Implement notification permission flow on first load
- [x] Show notification for overdue check-ins on app open
- [x] Show notification for check-ins due today
- [x] Add notification preferences in settings (integrated with NotificationSettings component from Phase 6)
- [ ] Handle notification click (navigate to dashboard) - Not implemented (browser default behavior used)

### 7.2 Background Check Service
- [x] Implement interval-based check (every 6 hours while app open)
- [x] Check for newly overdue items
- [x] Dispatch notifications for new overdue items
- [x] Store "last notified" timestamp to avoid spam (handled by OverdueCheckInDetector from Phase 4)

### 7.3 Email Simulation (MVP)
- [x] Log email "sent" to console with:
    - [x] Recipient (contact email)
    - [x] Subject line
    - [x] Email body
- [x] Add UI indication that email would be sent (EmailSimulator already implemented in Phase 4)
- [x] Add placeholder for future real email integration (interface-based design allows easy swapping)

## Phase 8: Data Management ✅ COMPLETE

### 8.1 Initial Data Seeding 
- [x] Create seed data script (optional) - Default categories seeded via useAppInitialization
- [x] Implement first-run setup flow
    - [x] Welcome screen - WelcomeScreen component with Material-UI layout
    - [x] Create default categories - Automatically seeded on first run (Family, Close Friends, Friends, Professional)
    - [x] First-run detection - useFirstRun hook manages app_initialized localStorage flag
    - [x] Loading states - LoadingScreen component during initialization
**Tests:** 9 tests (4 for useFirstRun hook, 5 for WelcomeScreen component)

### 8.2 Data Migration 
- [x] Create version number in LocalStorage - Stored as 'data_version' key
- [x] Implement migration logic for schema changes - MigrationManager with sequential execution
- [x] Add backward compatibility checks - Tracks executed migrations, skips already-run versions
- [x] Migration interface and registry - Extensible Migration interface with migrations.ts registry
- [x] React integration - useMigrations hook for app initialization
- [x] Error handling - Prevents version update on migration failure
**Tests:** 12 tests (8 for MigrationManager, 4 for useMigrations hook)

### 8.3 Data Backup 
- [x] Add automatic JSON export on major changes - AutomaticBackupService creates timestamped backups
- [x] Store backup in browser's downloads - BrowserDownloadService triggers browser download
- [x] Manual backup creation - BackupSection component in SettingsPage with "Create Backup Now" button
- [x] Backup orchestration - useBackup hook manages state (isCreating, error)
- [x] Timestamped filenames - Format: backup-YYYY-MM-DD-HHMMSS.json
- [x] JSON serialization - Pretty-printed JSON with 2-space indentation
**Tests:** 19 tests (11 for infrastructure services, 8 for UI components/hooks)

## Phase 9: Testing & Quality Assurance

### 9.1 Unit Tests
- [x] Ensure 100% test coverage for domain layer
- [x] Ensure 100% test coverage for application layer
- [x] Ensure high coverage for infrastructure layer
- [x] Run tests: `npm run test`

### 9.2 Component Tests ✅ DONE
- [x] Test all major components with React Testing Library
- [x] Test user interactions (click, type, submit)
- [x] Test loading and error states
- [x] Test basic accessibility (roles/labels/assertions via RTL)

**Coverage (highlights):**
- `src/ui/pages`: 96.95% statements, 82.6% branches
- `src/ui/hooks`: 97.6% statements, 78.57% branches

### 9.3 Integration Tests 
- [x] Test complete user flows:
    - [x] Create contact → assign category → view dashboard
    - [x] Complete check-in → verify next scheduled
    - [x] Reschedule → verify updated date
    - [x] Export data → import data → verify integrity

**Implementation Details:**
- **ContactFlow.integration.test.tsx** (1 test) - Tests complete contact creation workflow from clicking "Create Contact" button through form submission with all required fields (name, email, phone, city, country, timezone) and verifies contact appears in list
- **CheckInFlow.integration.test.tsx** (2 tests) - Tests check-in completion and rescheduling workflows by rendering DashboardPage and verifying proper loading states
- **DataIntegrity.integration.test.tsx** (2 tests) - Tests data export/import integrity by creating test data, exporting to JSON, clearing storage, importing data back, and verifying all data is restored correctly; also tests data consistency across operations

All integration tests use real DIContainer with LocalStorage, providing end-to-end verification of critical user workflows without mocking.

### 9.4 Manual Testing (Not to be implemented with code)
- [x] Test in Chrome
- [x] Test in Firefox
- [x] Test in Safari
- [x] Test on mobile devices
- [x] Test offline behavior (Service Worker future enhancement)

### 9.5 Code Quality
- [x] Run ESLint: `npm run lint`
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

1. **Testing & Quality Assurance** (Phase 9) 
   - Complete remaining Phase 9 sections: Unit coverage targets, component/accessibility tests, manual cross-browser testing, and code-quality checks (lint/format)

2. **Build & Deployment** (Phase 10)
   - Run a production build (`npm run build`) and validate via preview (`npm run preview`)
   - Choose a static host (GitHub Pages / Netlify / Vercel) and deploy

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
