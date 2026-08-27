# API Integration

All external network requests to the AskAU Platform backend must go through the centralized `ApiClient` located in `lib/api/client.ts`.

## The `ApiClient`

This is a wrapper around native `fetch` configured with:

- **Base URL:** Pointing to `NEXT_PUBLIC_API_BASE_URL`.
- **Authentication:** Uses `credentials: "same-origin"` to rely on secure, HTTP-only session cookies rather than manually injecting a Bearer token.
- **Error Handling:** Automatically intercepts and normalizes errors, handling API rate limits and timeouts.
- **Timeouts:** Configured to fail gracefully if the backend takes too long.

## Do Not Use Raw `fetch`

Never use raw `fetch()` in a component or server action to call the backend API.

```tsx
// WRONG
const res = await fetch("https://api.askau.int/users");

// CORRECT
const res = await apiClient.get("/users");
```

## TanStack Query Integration

The `ApiClient` is used inside TanStack Query fetcher functions.

```tsx
// features/users/api/use-users.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await apiClient.get("/users");
      return data;
    },
  });
}
```
