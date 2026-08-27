# API Contract

To maintain a robust integration between the AskAU Frontend and the AskAU Platform Backend, we rely on a strict API contract.

## OpenAPI (Swagger)

The backend exposes an OpenAPI 3.0 specification. This specification is the source of truth for all API routes, request payloads, and response structures.

## Type Synchronization

We do not manually write TypeScript interfaces for API responses if they are complex. Instead, we generate types from the OpenAPI specification to ensure they are always in sync.

1. The backend publishes an updated `swagger.json`.
2. We use OpenAPI generators (like `openapi-typescript`) to generate static `.d.ts` types in the frontend.
3. These types are imported into our feature `api/` folders and applied to the TanStack Query hooks.

## Handling Breaking Changes

If the backend introduces a breaking change (e.g., renaming a field, changing a required parameter), the type generation will cause the frontend build to fail. This is intentional and prevents runtime errors in production. The frontend developer must update the UI components to match the new contract.