# Contact Check-in Application

A single-page web application to track personal contacts and schedule regular check-in calls. Built with React, TypeScript, and Vite following Test-Driven Development (TDD) and Domain-Driven Design (DDD) principles.

## Overview

The Contact Check-in Application helps you maintain meaningful relationships by organizing contacts into categories with customizable check-in frequencies. The app schedules reminders, tracks check-in history, and helps ensure you stay connected with the people who matter most.

**Architecture**: Frontend-only application with browser LocalStorage persistence. No backend server required - runs entirely in the browser.

## Features (Planned)

- **Contact Management**: Store contact details including phone, email, location, timezone, and relationship context
- **Categorization**: Organize contacts by relationship type (family, friends, work, etc.)
- **Smart Scheduling**: Set check-in frequencies per category (e.g., weekly, monthly, quarterly)
- **Check-in Tracking**: Mark check-ins complete with notes, automatically schedule the next one
- **Dashboard**: View upcoming and overdue check-ins at a glance
- **Browser Notifications**: Get reminders for due and overdue check-ins
- **Data Portability**: Export/import data as JSON or CSV
- **Offline-First**: Works entirely in your browser with LocalStorage

## Tech Stack

### Core
- **React 19** - UI framework
- **TypeScript 5.9** - Type-safe development
- **Vite 7** - Build tool and dev server

### UI & Styling
- **Material-UI (MUI) 7** - Component library
- **Emotion** - CSS-in-JS styling

### Utilities
- **React Router 7** - Client-side routing
- **date-fns 4** - Date manipulation
- **uuid 13** - Unique identifier generation

### Testing
- **Vitest 4** - Unit test runner
- **React Testing Library** - Component testing
- **jsdom** - DOM simulation for tests

### Code Quality
- **ESLint 9** - Linting
- **TypeScript ESLint** - TypeScript-specific linting rules

## Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd contact-connection-app
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

Create an optimized production build:
```bash
npm run build
```

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

Run tests once:
```bash
npm run test:run
```

Run tests with UI:
```bash
npm run test:ui
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Test Philosophy

This project follows **strict TDD** with:
- Tests written before implementation (Red-Green-Refactor)
- 100% test coverage for domain and application layers
- No mocking frameworks - use in-memory test doubles instead
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

## Project Structure

```
src/
├── domain/                 # Pure TypeScript domain models (no React/browser APIs)
│   ├── contact/
│   │   ├── collections/    # Typed collection classes
│   │   ├── __tests__/      # Domain tests
│   │   ├── Contact.ts      # Contact entity
│   │   ├── ContactId.ts    # UUID value object
│   │   ├── PhoneNumber.ts  # Phone value object with validation
│   │   ├── EmailAddress.ts # Email value object with validation
│   │   ├── Location.ts     # Location with timezone
│   │   └── ...             # Other value objects
│   ├── category/           # Category domain (planned)
│   └── checkin/            # Check-in domain (planned)
├── application/            # Use cases and services (planned)
│   ├── contacts/
│   ├── categories/
│   └── checkins/
├── infrastructure/         # LocalStorage adapters (planned)
│   ├── storage/
│   └── notifications/
├── ui/                     # React components (planned)
│   ├── components/
│   ├── pages/
│   └── hooks/
├── test/                   # Test setup
│   └── setup.ts
└── main.tsx
```

## Architecture

### Hexagonal Architecture (Ports & Adapters)

The application follows **dependency inversion** with layers:

1. **Domain Layer** (core)
   - Pure TypeScript with no external dependencies
   - Value objects, entities, domain services
   - Business logic and invariants

2. **Application Layer**
   - Use cases coordinating domain operations
   - Service interfaces (ports)
   - No UI or infrastructure concerns

3. **Infrastructure Layer**
   - LocalStorage adapters
   - Browser notification service
   - Repository implementations

4. **UI Layer** (React)
   - Presentation components
   - Custom hooks wrapping use cases
   - React Router setup

**Dependency Flow**: Always inward toward domain
```
UI → Infrastructure → Application → Domain
```

### Design Patterns

- **Factory Functions**: Create domain objects with validation
- **Repository Pattern**: Abstract data persistence
- **Value Objects**: Immutable, validated primitives (ContactId, PhoneNumber, etc.)
- **Entity Pattern**: Domain objects with identity (Contact)
- **Collection Pattern**: Type-safe wrappers around arrays with common operations
- **Dependency Injection**: Via React Context

### Key Principles

1. **Test-Driven Development**: Red-Green-Refactor cycle
2. **Domain-Driven Design**: Rich domain model, ubiquitous language
3. **SOLID Principles**: Especially Single Responsibility and Dependency Inversion
4. **Immutability**: All domain objects frozen
5. **Type Safety**: Branded types for value objects prevent primitive obsession

## Development Status

### ✅ Completed (Phase 1 & 2.1)

- [x] Project setup with Vite, React, TypeScript
- [x] Testing infrastructure with Vitest
- [x] Contact domain implementation:
  - ContactId (UUID)
  - PhoneNumber (E.164 validation)
  - EmailAddress (validation & normalization)
  - Location (with timezone)
  - RelationshipContext
  - ImportantDate
  - Contact entity
  - ContactRepository interface
- [x] Collection abstractions:
  - BaseCollection (generic)
  - ContactCollection
  - ImportantDateCollection
- [x] 68 passing tests

### 🚧 In Progress

- Category domain
- Check-in domain
- Application services
- Infrastructure implementations
- UI components

See [internal-documents/contact-checkin-tasks.md](./internal-documents/contact-checkin-tasks.md) for complete roadmap.

## Contributing

### Development Workflow

1. **Write tests first** (TDD Red phase)
2. **Implement minimal code** to pass tests (TDD Green phase)
3. **Refactor** for clarity and simplicity (TDD Refactor phase)
4. **Ensure all tests pass**: `npm test`
5. **Lint your code**: `npm run lint`
6. **Commit with descriptive messages**

### Code Review Checklist

- [ ] All methods ≤8 lines
- [ ] Cognitive complexity ≤4
- [ ] Tests written before implementation
- [ ] 100% test coverage for new domain/application code
- [ ] No mocking frameworks used
- [ ] Domain objects are immutable
- [ ] Proper dependency flow (inward toward domain)
- [ ] TypeScript strict mode with no `any`

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Project context for Claude Code
- **[.claude/rules.md](./.claude/rules.md)** - Development rules and patterns
- **[internal-documents/](./internal-documents/)** - Design documents and task lists

## License

Private project - All rights reserved

## Acknowledgments

Built with:
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material-UI](https://mui.com/)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
