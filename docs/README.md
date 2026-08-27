# AskAU Frontend Documentation

Welcome to the AskAU Frontend documentation. This directory contains detailed architectural, security, and development guidelines to help you understand and contribute to the project.

## Directory Structure

The documentation is organized into the following areas:

- **[`architecture/`](./architecture/)**: High-level overview, frontend architecture, data flow, and security model.
- **[`development/`](./development/)**: Local setup, component guidelines, testing strategy, and contribution guidelines.
- **[`theming/`](./theming/)**: Design tokens, dark mode, and Tailwind v4 setup.
- **[`i18n/`](./i18n/)**: Internationalization (i18n) setup, supported languages, RTL guidelines, and translation management.
- **[`api/`](./api/)**: API contract, integration patterns, and OpenAPI generation.
- **[`authentication/`](./authentication/)**: Microsoft Entra ID setup via NextAuth.js.
- **[`security/`](./security/)**: Threat model and security guidelines.
- **[`accessibility/`](./accessibility/)**: WCAG 2.2 AA compliance standards.
- **[`deployment/`](./deployment/)**: CI/CD and deployment instructions.
- **[`decisions/`](./decisions/)**: Architecture Decision Records (ADRs).

## Getting Started

If you are a new developer onboarding to the project, please start with:

1. [Development Setup](./development/setup.md)
2. [Contribution Guidelines](./development/contribution-guidelines.md)
3. [Architecture Overview](./architecture/overview.md)

## Tech Stack Overview

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/docs)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **i18n**: [`next-intl`](https://next-intl-docs.vercel.app/)
- **Auth**: [NextAuth.js (v5)](https://next-auth.js.org/)