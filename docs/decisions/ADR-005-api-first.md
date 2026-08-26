# ADR 005: API-First Integration

## Status
Accepted

## Context
The frontend needs to communicate securely and reliably with the AskAU Platform backend. Direct `fetch` calls scattered throughout the codebase lead to inconsistent error handling, duplicated token injection logic, and difficult testing.

## Decision
All backend communication will be routed through a centralized `ApiClient` (`lib/api/client.ts`).

## Consequences
- **Positive**: Standardized error handling (e.g., `ApiError` classes).
- **Positive**: Centralized request timeouts, retries, and token injection.
- **Positive**: Trivial to implement a mock layer (MSW) by intercepting the central client during development.
