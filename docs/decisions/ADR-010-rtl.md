# ADR 010: RTL Support via Logical Properties

## Status

Accepted

## Context

Supporting Arabic requires the entire UI layout to mirror from Left-to-Right (LTR) to Right-to-Left (RTL). Maintaining two separate stylesheets or overriding LTR styles with RTL classes is a maintenance nightmare.

## Decision

We will strictly use CSS Logical Properties (e.g., `margin-inline`, `padding-block`, `start`, `end`) in Tailwind instead of physical properties (`left`, `right`).

## Consequences

- **Positive**: The browser automatically handles layout mirroring based on the `dir="rtl"` attribute on the HTML tag. Zero extra CSS required.
- **Negative**: Developers must unlearn physical properties (`ml-4`, `pr-2`) and adopt logical properties (`ms-4`, `pe-2`).
