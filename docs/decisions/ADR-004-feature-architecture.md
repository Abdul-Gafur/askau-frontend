# ADR 004: Feature-Oriented Architecture

## Status
Accepted

## Context
Traditional Next.js applications often group files by technical role (e.g., a `components/` folder with 50 files, a `hooks/` folder with 30 files). As the application grows, locating all the pieces related to a single feature (e.g., "Chat") becomes difficult.

## Decision
We will organize the codebase using a feature-oriented architecture (`features/*`). Generic, highly reusable elements go in `components/ui`, while feature-specific components, hooks, and types are co-located in their respective feature directories.

## Consequences
- **Positive**: High cohesion. It is easy to find everything related to a specific feature.
- **Positive**: Easier to extract features into micro-frontends or separate packages in the future.
- **Negative**: Requires developers to carefully decide whether a component is "generic" or "feature-specific".
