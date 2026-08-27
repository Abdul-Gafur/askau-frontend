# Accessibility (WCAG 2.2 AA)

AskAU is committed to digital accessibility. We target **WCAG 2.2 AA** compliance to ensure the platform is usable by everyone.

## Core Practices

### 1. Semantic HTML

Use the correct HTML elements for their intended purpose.

- Use `<button>` for actions, `<a>` for navigation.
- Use proper heading hierarchies (`<h1>` to `<h6>`). Do not skip heading levels.
- Use `<nav>`, `<main>`, `<aside>`, and `<header>` regions.

### 2. Radix UI (shadcn/ui)

We heavily rely on `shadcn/ui`, which is built on Radix UI primitives. Radix handles much of the complex accessibility (focus management, ARIA roles, keyboard navigation) automatically.

- **Rule:** Do not break the accessibility features built into these components. If you build a custom interactive component, you must implement the same level of keyboard support.

### 3. Keyboard Navigation

- Every interactive element must be reachable via the `Tab` key.
- Focus outlines must be visible (do not remove `outline-none` without providing a distinct focus ring, e.g., `focus-visible:ring`).

### 4. Color Contrast

- Text must have a contrast ratio of at least 4.5:1 against its background.
- Our design tokens in `globals.css` are pre-tested for contrast. Stick to them.

### 5. Screen Readers

- Provide `aria-label` or `sr-only` text for icon-only buttons.
- Use `aria-describedby` to link form inputs to their error messages.
- Ensure images have descriptive `alt` text.

## Testing Accessibility

- Use the **Lighthouse** tab in Chrome DevTools to run accessibility audits locally.
- Test keyboard navigation manually by unplugging your mouse.
