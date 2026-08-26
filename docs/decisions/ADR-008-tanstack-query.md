# ADR 008: TanStack Query

## Status
Accepted

## Context
Managing asynchronous server state (loading states, error states, caching, deduplication, and background refetching) using standard React `useEffect` and `useState` is error-prone and leads to boilerplate code.

## Decision
We will use TanStack Query (React Query) for all server state management in Client Components.

## Consequences
- **Positive**: Drastically simplifies data fetching logic.
- **Positive**: Built-in caching, pagination, and automatic background refetching.
- **Negative**: Adds a learning curve for developers unfamiliar with the query/mutation paradigm.
