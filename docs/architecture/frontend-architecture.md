# Frontend Architecture

The AskAU frontend strictly follows a **Feature-Oriented Architecture** alongside Next.js App Router conventions.

## Folder Structure

```text
app/                  # Next.js App Router (Pages, Layouts, Routing)
  [locale]/           # Dynamic route for internationalization
    layout.tsx        # Root layout (Providers, Shell)
    page.tsx          # Home page
components/           # Reusable, cross-feature components
  ui/                 # shadcn/ui generic primitives (Button, Input, etc.)
  layout/             # App shell (Header, Sidebar, Footer)
  common/             # Shared business components (e.g., CountrySelector)
config/               # Global configuration (Environment, Navigation, Site)
docs/                 # Project documentation
features/             # Business features (Domain logic)
  [feature-name]/     # e.g., 'chat', 'documents', 'analytics'
    components/       # Feature-specific UI components
    hooks/            # Feature-specific custom hooks
    api/              # Data fetching, TanStack query hooks
    types/            # Feature-specific TypeScript types
    utils/            # Feature-specific helpers
hooks/                # Global custom React hooks
i18n/                 # Internationalization setup and locale dictionaries
lib/                  # Core utilities and configs (API client, Auth, Utils)
public/               # Static assets (images, fonts, etc.)
styles/               # Global CSS and Tailwind directives (globals.css)
tests/                # Unit, integration, and E2E tests
types/                # Global TypeScript declarations
```

## Dependency Rules (Import Boundaries)

To prevent spaghetti code, imports must strictly flow downwards:

1. `app/` can import from `features/`, `components/`, and `lib/`.
2. `features/` can import from `components/` and `lib/`.
3. **Crucial:** A feature (`features/A`) **cannot** import from another feature (`features/B`). If logic is shared, it must be moved to `components/common/` or `lib/`.
4. `components/ui/` cannot import from `features/` or `components/common/`. It must remain purely presentational.

## Server vs. Client Components

By default, all components in the `app/` router are **Server Components**.

- **Server Components (Default):** Use for fetching data, accessing backend resources, and rendering static HTML. They cannot use React state (`useState`), effects (`useEffect`), or event listeners.
- **Client Components (`"use client"`):** Use for interactivity, state management, and accessing browser APIs. Push `"use client"` as far down the component tree as possible to minimize JavaScript bundle size.
