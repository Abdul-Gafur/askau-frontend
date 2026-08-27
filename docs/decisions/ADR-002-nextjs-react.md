# ADR 002: Next.js and React

## Status

Accepted

## Context

The frontend needs to be robust, performant, and support complex enterprise requirements (i18n, authentication, SEO, and fast load times). React is the industry standard for component-driven UIs, but building a production-ready React app from scratch requires assembling many disparate libraries (routing, bundling, SSR).

## Decision

We will use Next.js 15 (App Router) as the core framework.

## Consequences

- **Positive**: Out-of-the-box support for Server Components, SSR, and API routes.
- **Positive**: Excellent ecosystem support and enterprise-grade performance.
- **Negative**: Steeper learning curve for developers transitioning from traditional Single Page Applications (SPAs) due to the App Router's server-first paradigm.
