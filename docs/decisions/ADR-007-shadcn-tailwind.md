# ADR 007: shadcn/ui and Tailwind CSS

## Status

Accepted

## Context

We need a UI component library that is accessible, looks professional, and is highly customizable to match the AU Commission's branding. Traditional component libraries (MUI, Ant Design) are notoriously difficult to customize heavily and often introduce significant bundle bloat.

## Decision

We will use Tailwind CSS v4 for utility-first styling, and `shadcn/ui` for our base accessible component patterns.

## Consequences

- **Positive**: We own the component code (it lives in our repository), allowing infinite customization.
- **Positive**: Excellent accessibility primitives out-of-the-box (powered by Radix UI).
- **Negative**: Slightly more verbose markup due to Tailwind utility classes.
