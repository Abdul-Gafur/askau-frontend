# Frontend Data Flow

The AskAU frontend orchestrates data between the Backend API and the React UI.

## Data Fetching Strategy

We use **TanStack Query** (React Query) as our primary state management and data fetching library for asynchronous backend data.

### The Flow

1. **User Action / Page Load:** A user navigates to a page or interacts with the UI.
2. **Server Components (Initial Load):** Where possible, data is pre-fetched on the server using Next.js Server Components. We dehydrate the TanStack Query state and pass it to the client.
3. **Client Components (Interactivity):** The client rehydrates the cache. Subsequent interactions (pagination, filtering, mutations) trigger TanStack Query hooks.
4. **API Client:** The query hooks call the centralized `ApiClient` (`lib/api/client.ts`).
5. **Network Request:** The `ApiClient` injects the authentication token and handles the REST request to the AskAU backend.
6. **Response & Cache:** The response is cached by TanStack Query, and the UI re-renders automatically.

## API Client Responsibilities

The centralized `ApiClient` is responsible for:

- Standardizing Request/Response formats.
- Injecting the Bearer token for authenticated routes.
- Handling global errors (e.g., redirecting on 401 Unauthorized).
- Refreshing tokens (if applicable).
- Timeout management.

## State Management

- **Server State (API Data):** Handled entirely by TanStack Query.
- **Client State (Ephemeral):** Handled by React `useState` and `useReducer`.
- **Global UI State:** Handled by URL Search Parameters (preferred for shareable state like filters) or React Context.
