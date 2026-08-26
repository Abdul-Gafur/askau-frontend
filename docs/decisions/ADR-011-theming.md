# ADR 011: Theming with CSS Variables

## Status
Accepted

## Context
The application must support Light, Dark, and System theme preferences. Switching themes using JavaScript context can cause performance issues and a "flash of incorrect theme" (FOIT) on initial load.

## Decision
We will implement theming using CSS variables defined in `globals.css` (e.g., `--background`, `--foreground`), coupled with `next-themes` for theme detection and toggling.

## Consequences
- **Positive**: Instant theme switching handled entirely by the browser's CSS engine.
- **Positive**: Prevents FOIT during server-side rendering.
- **Negative**: Requires mapping Tailwind's color palette to our custom CSS variables in the configuration.
