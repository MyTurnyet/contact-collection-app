# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Contact Check-in Application - A single-page web application to track personal contacts and schedule regular check-in calls. Built with React + TypeScript + Vite frontend using LocalStorage for persistence. Follows XP/TDD principles with strict OO design.

**Current Status**: Phase 1 Complete - Project infrastructure and testing configured. Ready to begin domain modeling.

**IMPORTANT**: See `.claude/rules.md` for detailed development rules including:
- Maximum method size: 8 lines
- Maximum cognitive complexity: 4
- TDD required (tests first)
- No mocking frameworks
- Immutability and dependency inversion principles

## Development Commands

### Core Commands
- `npm run dev` - Start Vite development server with HMR at http://localhost:5173
- `npm run build` - Type check with `tsc -b` and build production bundle
- `npm run lint` - Run ESLint on all TypeScript/TSX files
- `npm run preview` - Preview production build locally
- `npm run test` - Run tests in watch mode with Vitest
- `npm run test:ui` - Run tests with UI dashboard
- `npm run test:run` - Run tests once (CI mode)
- `npm run test:coverage` - Run tests with coverage report

### TypeScript Configuration
- Uses TypeScript project references (tsconfig.json is a solution file)
- `tsconfig.app.json` - App source code configuration (src directory)
- `tsconfig.node.json` - Node/config file configuration (vite.config.ts, etc.)
- Strict mode enabled with additional checks: noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch

## Architecture

### Current Tech Stack
- **Build Tool**: Vite 7.x with @vitejs/plugin-react (uses Babel for Fast Refresh)
- **Framework**: React 19.x with TypeScript 5.9.x
- **Linting**: ESLint 9.x flat config with TypeScript ESLint, React Hooks, and React Refresh plugins
- **Target**: ES2022 with DOM APIs, bundler module resolution

### Planned Clean Architecture (per internal-documents/contact-checkin-tasks.md)

The codebase will follow Hexagonal/Ports & Adapters architecture:

```
src/
├── domain/           # Domain models and interfaces (no framework dependencies)
├── application/      # API client interfaces and use case logic
├── infrastructure/   # HTTP client implementations
└── ui/
    ├── components/   # Reusable React components
    └── pages/        # Page-level components
```

**Dependency Flow**: Always inward toward domain
- Infrastructure depends on Application
- Application depends on Domain
- Domain has zero external dependencies

### Data Persistence

**LocalStorage-based** (no backend server):
- All data stored in browser LocalStorage
- Repositories abstract storage behind interfaces
- JSON serialization/deserialization
- Data versioning for future migrations
- Export/import functionality for backups

### Core Domain Concepts

**Contact**:
- ContactId, PhoneNumber, EmailAddress (value objects with validation)
- Location with timezone support
- RelationshipContext (how you know them)

**Category**:
- CategoryId, CheckInFrequency
- Determines check-in schedule (e.g., "Family - Monthly", "Friends - Quarterly")

**CheckIn**:
- ScheduledDate, CompletionStatus
- When marked complete, next check-in schedules from original date (not completion date)

### Design Principles from Project Spec

1. **Maximum method size: 8 lines** - Extract helper methods liberally
2. **Maximum cognitive complexity: 4** - Keep logic simple and focused
3. **Immutability by default** - Use `const`, immutable data structures
4. **Dependency Inversion** - Depend on interfaces, not concrete classes
5. **Composition over inheritance** - Build complex behavior from simple objects
6. **"Ask, Don't Tell"** - Objects should encapsulate behavior
7. **No static methods or singletons** - All dependencies injected
8. **Interface Segregation** - Small, focused interfaces per use case

### Testing Approach

Per project specifications:
- Test-Driven Development (tests written first)
- **No mocking frameworks** - Use real implementations or simple test doubles
- One assertion concept per test method
- Given-When-Then structure
- React Testing Library for component tests (when implemented)
- End-to-end tests with Playwright or Cypress (future)

Create test doubles like:
- `InMemoryContactRepository` for testing
- `FakeEmailNotifier` that captures calls for assertions

## Key Implementation Notes

### When Adding Features

1. **Define domain types first** (src/domain/)
   - Create TypeScript interfaces for domain models
   - Value objects with validation (ContactId, PhoneNumber, EmailAddress)
   - Keep domain layer pure - no React, no HTTP

2. **Define application interfaces** (src/application/)
   - API client interfaces (IContactClient, ICategoryClient)
   - Use case interfaces if complex logic needed

3. **Implement infrastructure** (src/infrastructure/)
   - HTTP client implementations using Fetch API or Axios
   - Error handling and retry logic
   - Type-safe request/response mapping

4. **Build UI components** (src/ui/)
   - Small, focused components
   - Separate presentation from logic
   - TypeScript interfaces for all props
   - Handle loading and error states consistently

### Installed Dependencies

Core libraries:
- **React Router DOM** - Page navigation (react-router-dom)
- **date-fns** - Date manipulation and formatting
- **uuid** - Unique ID generation for entities
- **Material-UI** - Component library (@mui/material, @emotion/react, @emotion/styled, @mui/icons-material)

Testing:
- **Vitest** - Test runner
- **React Testing Library** - Component testing
- **jsdom** - Browser environment simulation

### Form Validation Requirements

- PhoneNumber validation (format checking)
- EmailAddress validation (RFC compliant)
- Location/timezone selection and validation
- Category assignment validation
- Date picker for rescheduling check-ins

### State Management

Planned approach:
- React Context for Dependency Injection
- Local state with useState for UI state
- Custom hooks for domain state management (useContacts, useCategories, useCheckIns)
- Keep state close to where it's used
- Lift state only when necessary

## Browser Features

### Notifications
- Browser notifications for overdue check-ins
- Permission request flow on first load
- Notification preferences in settings
- Email simulation (console.log for MVP)

### Background Processing
- Interval-based checking (every hour while app open)
- Overdue detection on app startup
- "Last notified" timestamp to avoid spam

### Deployment
- Static site - runs entirely in browser
- No server required
- Can deploy to GitHub Pages, Netlify, Vercel, or self-host

## ESLint Configuration

Flat config format (eslint.config.js):
- Ignores `dist` directory
- Applies to `**/*.{ts,tsx}` files
- Extends: @eslint/js recommended, typescript-eslint recommended, react-hooks flat recommended, react-refresh vite config
- ES2020 syntax, browser globals
