# Theming

The AskAU frontend uses **Tailwind CSS v4** as its core styling engine, combined with `next-themes` to handle Light/Dark mode toggling.

## Core Libraries

- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4) for utility-first styling.
- `next-themes` for system preference detection and theme switching.
- `shadcn/ui` components mapped to Tailwind semantic variables.

## How it works

1. **Global CSS:** Our `src/app/globals.css` file defines all CSS variables (design tokens). It uses the `@theme` directive (new in v4) to expose these to Tailwind.
2. **Provider:** The `ThemeProvider` (wrapping the root layout) adds `class="dark"` to the `<html>` tag based on user preference.
3. **Utilities:** We exclusively use semantic Tailwind utilities (e.g., `bg-background`, `text-primary`) rather than hardcoded colors (e.g., `bg-blue-500`). This ensures automatic theme switching.

For more details, see:
- [Design Tokens](./design-tokens.md)
- [Dark Mode](./dark-mode.md)