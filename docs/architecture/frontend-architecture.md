# Quote.Vote – Frontend Architecture Overview

This document outlines the architecture and technical approach for the Quote.Vote frontend application, built as a React Single Page Application (SPA).

---

## Core Technologies

- **Framework**: React (SPA)
- **Language**: TypeScript
- **UI Library**: Material-UI
- **API Communication**: GraphQL via Apollo Client
- **State Management**:
  - **Redux Toolkit** - Primary global state management with slices: `user`, `ui`, `chat`, `filter`
  - **Redux Persist** with LocalForage - Offline data storage and state persistence
  - **Apollo Client Cache** - Server-side GraphQL data caching and management
  - **React Context** - Material-UI theming (no custom contexts for state)
  - **Local component state** - Simple UI interactions via `useState`
- **Forms**: React Hook Form (recommended)

---

## File Structure (High-Level)

The frontend codebase resides in the `client/` directory. While not using Next.js, it retains a modular folder structure similar to typical component-first React applications.

- **`client/src/pages/`** – React Router-managed views, grouped by user flows (e.g., Feed, Auth, Profile)
- **`client/src/components/`** – Reusable React components organized by feature (`feed/`, `post/`, `chat/`, etc.) and layer (`ui/` for atomic elements, `layout/`).
- **`client/src/lib/`** – Shared logic, utility functions, GraphQL client setup (`apollo.ts`), authentication helpers (`auth.ts`), custom hooks, etc.
- **`client/src/contexts/`** – React Context providers for global state (Theme, Auth).
- **`client/src/types/`** – TypeScript definitions including GraphQL-generated types.

---

## Key Architectural Decisions & Patterns

### Component Composition

- UI is built from reusable, composable components.
- Accessibility (a11y) is embedded into design: semantic HTML, ARIA labels, keyboard navigation.

### Routing

- Managed via **React Router**, not Next.js. All routing logic is client-side.

### GraphQL Integration

- Apollo Client handles:
  - `useQuery` for reads
  - `useMutation` for writes
  - `useSubscription` for real-time updates
- Client is configured in `lib/apollo.ts`.
- Queries and mutations defined close to components or in `.graphql` files.

## State Management Summary

The application employs a layered state management approach:

- **Global App State**: Managed by Redux Toolkit, covering authentication, UI state, chat, and filters.
- **Server State**: Apollo Client Cache automatically handles GraphQL data (posts, users, comments).
- **Theming**: Material-UI's ThemeProvider ensures consistent styling.
- **Local State**: Component-level `useState` is used for simple UI interactions (form inputs, toggles).

> **Note**: No Zustand, Jotai, or custom React Context is used for state management.

### Redux Toolkit Implementation

- **Simplified Redux Logic**: Uses `createSlice` and `configureStore`
- **Immutability**: Built-in Immer integration for immutable updates
- **DevTools Integration**: Automatic Redux DevTools setup in development
- **Type Safety**: Better TypeScript integration

### State Structure

```javascript
{
  user: {}, // User authentication and profile data
  ui: {},   // UI state (modals, loading states, etc.)
  chat: {}, // Chat/messaging functionality
  filter: {} // Data filtering and search state
}
```

### Server State (Apollo Client Cache)

Apollo Client Cache automatically handles all GraphQL data (posts, users, comments) with intelligent caching and synchronization.

### Theming

Material-UI's built-in ThemeProvider ensures consistent styling across the application.

### Local Component State

Component-level `useState` is used for simple UI interactions like form inputs and toggles.

### Persistence Layer

- **Redux Persist** with **LocalForage** for client-side data persistence
- Automatic state rehydration on app startup
- Selective persistence configuration per state slice

### Authentication

- Managed with client-side tokens and React Context
- Protected routes implemented via layout guards or route checks
- Tokens injected into GraphQL headers for secure communication

> **Note**: This project does not use Zustand, Jotai, or custom React Context for state management.

## Deployment

- Built with Vite.
- Compiled into static assets.
- Hosted via Netlify, Vercel, or S3/CloudFront.

> **Note**: There is no server-side rendering or static generation. All rendering is performed in-browser via the React runtime.

---

## Alignment with Quote.Vote Values

- **Minimalist, intentional UI**: No gamification, metrics, or engagement maximization.
- **Client-side by design**: Decentralizes logic and avoids centralized editorial control.
- **Civic transparency**: Code and components are structured for easy inspection and understanding.

---
