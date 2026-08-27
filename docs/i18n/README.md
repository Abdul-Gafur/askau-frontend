# Internationalization (i18n)

The AskAU Frontend is designed from the ground up to support multiple languages and locales to serve the entire African Union Commission.

## Tech Stack

We use [`next-intl`](https://next-intl-docs.vercel.app/) for all internationalization needs in this Next.js 15 App Router project.

## How it works

1. **Dynamic Routing:** All pages are located inside the `app/[locale]/` directory. The `locale` parameter is dynamically injected into all layouts and pages.
2. **Middleware:** `src/middleware.ts` intercepts requests, detects the user's preferred language (via cookies or headers), and redirects/rewrites the URL to the correct locale route.
3. **Dictionaries:** Translations are stored in JSON files per language. They are loaded dynamically on the server and passed to the components.
4. **Server vs Client:** `next-intl` supports both Server Components (using `getTranslations`) and Client Components (using `useTranslations`).

## Adding a New Language

To add a new language, refer to the [Supported Languages](./supported-languages.md) guide.

## Translation Guidelines

For naming keys, using variables, and managing dictionary files, refer to the [Translation Guidelines](./translation-guidelines.md).

## Right-to-Left (RTL) Support

Since we support Arabic, the layout must adapt seamlessly between LTR and RTL. Read the [RTL Guidelines](./rtl-guidelines.md) carefully to ensure you write directional-agnostic CSS.
