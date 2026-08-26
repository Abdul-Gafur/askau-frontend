# ADR 003: TypeScript

## Status
Accepted

## Context
Enterprise applications require high maintainability and low runtime error rates. JavaScript's dynamic typing often leads to elusive bugs that are only caught in production.

## Decision
We will use TypeScript with strict mode enabled (`strict: true`) for the entire frontend codebase. The use of the `any` type is strictly forbidden.

## Consequences
- **Positive**: Catch type-related bugs at compile time.
- **Positive**: Vastly improved IDE autocompletion and developer experience.
- **Negative**: Requires additional upfront effort to define interfaces and types, particularly when handling complex API responses.
