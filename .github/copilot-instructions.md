# NoobStore Web UI - Development Guidelines

## Codebase Overview

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + Material-UI (MUI)
- **State Management**: Zustand
- **API**: React Query (TanStack Query)
- **Language**: Vietnamese (UI text and comments)
- **Architecture**: Component-based with custom hooks

## Development Rules

### 1. Code Quality Standards

- **TypeScript**: Strict typing required, no `any` types
- **Modern JavaScript**: ES6+ features only, no `var`
- **Naming**: camelCase for functions/variables, PascalCase for components
- **Imports**: Absolute paths with `@/` alias from `src/`

### 2. Component Patterns

- **Functional Components**: React hooks only, no class components
- **File Structure**: `ComponentName/index.tsx` + `ComponentName/styles.module.css` (if needed)
- **Props**: Interface definitions for all component props
- **Styling**: Tailwind CSS classes, MUI components when appropriate

### 3. State Management

- **Zustand**: For global state management
- **React Query**: For server state (API calls)
- **Local State**: useState/useReducer for component state

### 4. API Integration

- **Client Pattern**: Custom client classes in `src/client/`
- **React Query**: Hooks in `src/react-query/`
- **Error Handling**: Proper error states and user feedback

### 5. Internationalization

- **Language**: Vietnamese text for all user-facing content
- **Consistency**: Use established translation patterns

### 6. Dependencies

- **No New Packages**: Only use existing dependencies unless explicitly approved
- **Version Control**: Keep dependencies updated but stable

## File Organization

```
src/
├── components/          # Reusable UI components
├── pages/              # Next.js pages/routes
├── client/             # API client classes
├── react-query/        # API hooks and queries
├── zustand/            # Global state stores
├── interface/          # TypeScript interfaces
├── constants/          # App constants and enums
├── utils/              # Utility functions
├── styles/             # Global styles and themes
└── hooks/              # Custom React hooks
```

## Commit Message Format

- `feat:` New features
- `fix:` Bug fixes
- `refactor:` Code restructuring
- `docs:` Documentation updates
- `style:` Code style changes
- `test:` Testing related changes
