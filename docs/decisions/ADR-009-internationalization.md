# ADR 009: Internationalization (next-intl)

## Status
Accepted

## Context
The African Union Commission operates in multiple official languages. The platform must support English, French, Arabic, and Portuguese from day one.

## Decision
We will use `next-intl` for all internationalization (i18n) needs.

## Consequences
- **Positive**: First-class support for Next.js App Router and React Server Components.
- **Positive**: Strong typing for translation keys, preventing missing translation errors at compile time.
- **Negative**: Requires strict discipline to never hardcode user-facing strings in the codebase.
