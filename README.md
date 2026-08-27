# AskAU Frontend

> **AskAU** — Enterprise AI Knowledge Assistant for the African Union Commission

[![CI](https://github.com/au-commission/askau-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/au-commission/askau-frontend/actions/workflows/ci.yml)

---

> **This repository is currently establishing the AskAU frontend foundation (Phase 1).**  
> The full chat UI and AI-powered features will be implemented in Phase 2.

---

## Overview

AskAU is a secure, enterprise-grade AI knowledge assistant for African Union Commission staff. It allows authenticated AU Commission faculty and staff to ask natural-language questions about approved organizational knowledge — policies, procedures, SOPs, guidelines, and official documents — and receive AI-generated answers grounded in those sources.

The frontend is maintained as a **separate repository** from the AskAU backend/platform. All communication is via documented REST APIs.

## Current Phase

**Phase 1 — Foundation**

This phase establishes:

- Project architecture and folder structure
- TypeScript + ESLint + Prettier configuration
- Design system (Tailwind CSS v4 + custom tokens)
- Dark/Light/System theme support
- Internationalization: English, French, Arabic (RTL), Portuguese
- Authentication boundary (Microsoft Entra ID via NextAuth.js v5)
- API client architecture with mock mode for development
- Application shell (header, sidebar, navigation)
- Minimal page placeholders
- Testing foundation (Vitest + Playwright)
- CI/CD pipelines
- Security and architecture documentation

## Technology Stack

| Category        | Technology                                  |
| --------------- | ------------------------------------------- |
| Framework       | Next.js 16 (App Router)                     |
| Language        | TypeScript 5 (strict)                       |
| UI              | React 19                                    |
| Styling         | Tailwind CSS v4                             |
| Auth            | NextAuth.js v5 + Microsoft Entra ID         |
| i18n            | next-intl                                   |
| Server State    | TanStack Query v5                           |
| Forms           | React Hook Form + Zod                       |
| Theme           | next-themes                                 |
| Package Manager | pnpm                                        |
| Testing         | Vitest + React Testing Library + Playwright |

## Prerequisites

- Node.js 24+
- pnpm 9+
- A Microsoft Entra ID App Registration (for auth — optional in dev with mock mode)

## Installation

```bash
# Clone the repository
git clone https://github.com/au-commission/askau-frontend.git
cd askau-frontend

# Install dependencies
pnpm install
```

> **Important**: Install the **complete** dependency set. Do not use flags like `--production`, `--omit=dev`, `--no-optional` or `--ignore-scripts`. The development dependencies (TypeScript, ESLint, Prettier, Tailwind, Next.js toolchain) are required for the app to build properly and for your editor to provide accurate intellisense.
>
> If an installation fails partway, delete `node_modules` and run `pnpm install` again. Do not hand-install the one package that errored to ensure your dependency tree matches everyone else's.
>
> Always commit any changes to `pnpm-lock.yaml` in the same commit when adding new dependencies.

```bash
# Set up environment
cp .env.example .env.local
# Edit .env.local with your values
```

## Environment Configuration

See [`.env.example`](.env.example) for all required variables.

**For development without a real backend**, set:

```env
NEXT_PUBLIC_USE_MOCK_API=true
NEXTAUTH_SECRET=any-32-char-random-string
```

**For production**, all server-only variables (`ENTRA_*`, `NEXTAUTH_SECRET`) must be set via secure secrets management. See [`docs/authentication/entra-id.md`](docs/authentication/entra-id.md).

## Development

```bash
pnpm dev          # Start development server (http://localhost:3000)
pnpm typecheck    # TypeScript type checking
pnpm lint         # ESLint
pnpm format       # Prettier formatting
pnpm format:check # Check formatting
```

## Testing

```bash
pnpm test           # Run unit + integration tests (Vitest)
pnpm test:watch     # Watch mode
pnpm test:coverage  # With coverage report
pnpm test:e2e       # End-to-end tests (Playwright)
pnpm test:e2e:ui    # Playwright UI mode
```

## Build

```bash
pnpm build    # Production build
pnpm start    # Start production server
```

## Architecture

```
User
 └── Next.js App (Frontend)
      └── Feature Layer (features/)
           └── Service Layer (lib/api/)
                └── AskAU Platform API (external)
                     └── RAG / LLM / Document Store
```

The frontend is **intentionally separated** from AI infrastructure. It communicates only through the AskAU Platform API. It never directly accesses LLMs, vector databases, or enterprise systems.

See [`docs/architecture/overview.md`](docs/architecture/overview.md) for full details.

## Security

- All authentication via Microsoft Entra ID (Azure AD)
- No secrets committed to source control
- Security headers configured (CSP, HSTS, X-Frame-Options)
- Frontend authorization checks are UX-only — **backend is authoritative**
- See [`docs/security/security-guidelines.md`](docs/security/security-guidelines.md)

## Accessibility

Targeting WCAG 2.2 AA. See [`docs/accessibility/wcag.md`](docs/accessibility/wcag.md).

## Internationalization

Supported languages: English, Français, العربية (RTL), Português.
See [`docs/i18n/README.md`](docs/i18n/README.md).

## Documentation

Full documentation is in the [`docs/`](docs/) directory.

## Contributing

See [`docs/development/contribution-guidelines.md`](docs/development/contribution-guidelines.md).

## License

Copyright © African Union Commission. All rights reserved.
This software is proprietary to the African Union Commission.
