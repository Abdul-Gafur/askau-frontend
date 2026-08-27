# AskAU Frontend Coding Standards

This document establishes the official coding standards for the AskAU Frontend repository. All contributions must adhere to these rules.

## 1. TypeScript

- **Strict Mode**: TypeScript strict mode is enabled and mandatory.
- **No `any`**: The use of `any` is strictly prohibited. If a type is truly unknown, use `unknown` and implement type narrowing.
- **Explicit Returns**: Exported functions and React components should generally have implicit return types inferred by TypeScript, except where explicit return types improve readability or prevent specific errors.
- **Interfaces over Types**: Prefer `interface` for object shapes and `type` for unions/intersections.

## 2. React

- **Functional Components**: Use functional components exclusively. No class components.
- **Hooks**: Follow the Rules of Hooks. Custom hooks should encapsulate complex component logic.
- **Memoization**: Do not prematurely memoize (`useMemo`, `useCallback`, `memo`). Only apply memoization when profiling indicates a measurable performance bottleneck.

## 3. Next.js (App Router)

- **Server Components Default**: All components are React Server Components by default.
- **Client Components**: Only use the `"use client"` directive when interactivity (state, effects, event listeners) is required.
- **Push Client Boundaries Down**: Keep `"use client"` as far down the component tree as possible to maximize server rendering and minimize JavaScript bundle sizes.
- **Data Fetching**: Prefer fetching data in Server Components or using TanStack Query in Client Components.

## 4. Architecture & Feature Organization

- **Feature-Oriented Architecture**: Group code by feature domain (e.g., `features/chat`, `features/settings`) rather than strictly by technical type (`components/`, `hooks/`).
- **The `app/` Directory**: Used strictly for routing, layouts, and page entry points. Pages should mostly act as shells that import feature components.
- **The `components/` Directory**: Reserved for generic, highly reusable UI components (e.g., buttons, inputs, dialogs) that are devoid of business logic.
- **The `lib/` Directory**: For core service singletons, API clients, and generic utilities.

## 5. Naming Conventions

- **Folders**: `kebab-case` (e.g., `auth-provider`, `chat-input`).
- **Files**: `kebab-case` (e.g., `api-client.ts`, `user-profile.tsx`).
- **React Components**: `PascalCase` (e.g., `ChatBubble`, `SidebarNavigation`).
- **Functions/Variables**: `camelCase` (e.g., `fetchUserData`, `isLoading`).
- **Types/Interfaces**: `PascalCase` (e.g., `User`, `ChatMessage`). Do not prefix interfaces with `I` (e.g., use `User`, not `IUser`).
- **Constants**: `UPPER_SNAKE_CASE` for global constants (e.g., `MAX_RETRIES`).

## 6. Imports

- **Absolute Imports**: Always use the `@/` path alias for absolute imports instead of relative paths (e.g., `import { Button } from "@/components/ui/button"`).
- **Import Ordering**: Group imports logically:
  1. Built-in Node/React/Next modules.
  2. Third-party dependencies.
  3. Internal absolute imports (`@/...`).
  4. Relative imports (only within the same feature folder).

## 7. Styling (Tailwind CSS v4 & shadcn/ui)

- **Utility-First**: Use Tailwind utility classes directly in `className`.
- **Merge Utilities**: Use `cn()` (clsx + tailwind-merge) for conditional class names and merging props.
- **Design Tokens**: Rely on the CSS variables defined in `globals.css` (e.g., `text-muted-foreground`, `bg-primary`) rather than hardcoded hex codes to ensure theme compatibility.
- **Logical Properties**: Always use logical properties for layout (`margin-inline`, `padding-block`, `start`, `end`) to guarantee automatic RTL layout mirroring for Arabic.

## 8. State Management

- **Server State**: Use **TanStack Query** for all asynchronous server state, data fetching, caching, and synchronization in client components.
- **Local State**: Use standard React state (`useState`, `useReducer`) for component-level UI state.
- **Global UI State**: Use React Context sparingly, only for truly global UI concepts (e.g., Theme, Auth state, i18n).
- **Avoid Global Stores**: Do not use Redux, Zustand, or Jotai unless the application develops incredibly complex client-side interactions that TanStack Query and Context cannot handle cleanly.

## 9. API Calls

- **Centralized Client**: All API calls must route through the `ApiClient` (`@/lib/api/client.ts`).
- **No Direct Fetch**: Do not use raw `fetch()` or `axios` directly in components.
- **Mock Mode Support**: The API client handles switching between the real backend and the MSW mock layer based on the `NEXT_PUBLIC_USE_MOCK_API` environment variable.
- **Error Handling**: Use the standardized `ApiError` hierarchy defined in `@/lib/api/errors.ts`. Do not throw generic Error objects for network failures.
