# ADR 012: Accessibility-First (WCAG 2.2 AA)

## Status

Accepted

## Context

The AskAU platform must be usable by all AU Commission staff, including those relying on assistive technologies.

## Decision

We will strictly target WCAG 2.2 AA compliance. We will enforce this using the `eslint-plugin-jsx-a11y` ruleset and by writing Playwright tests that validate ARIA roles and contrast.

## Consequences

- **Positive**: Ensures a highly inclusive platform.
- **Positive**: Radix UI (via shadcn/ui) handles complex keyboard navigation and focus management automatically.
- **Negative**: Requires vigilance during code review to ensure custom interactive components are properly labeled and focusable.
