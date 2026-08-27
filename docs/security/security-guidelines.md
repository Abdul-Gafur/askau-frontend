# General Security Guidelines

This document outlines the security hygiene expected from all frontend contributors. While the backend enforces authorization, the frontend is responsible for protecting the user from client-side attacks.

## 1. Cross-Site Scripting (XSS)

React protects against XSS by default by escaping string variables.

- **Rule:** Never use `dangerouslySetInnerHTML`. If you absolutely must render raw HTML (e.g., from a markdown parser), you must run it through a sanitizer like `DOMPurify` on the client.

## 2. Secrets Management

- **Rule:** Never hardcode passwords, API keys, or tokens in source code.
- **Rule:** Do not prefix a variable with `NEXT_PUBLIC_` unless it is genuinely safe for the entire world to see (like a public API URL or a Google Analytics ID). If it is a secret (like a database password or a private API key), leave off the prefix so it remains securely on the server.

## 3. Dependency Security

- **Rule:** Run `pnpm audit` regularly to check for vulnerable packages.
- **Rule:** Do not add arbitrary, unvetted npm packages. Prefer well-maintained, popular libraries.

## 4. Input Sanitization

While the backend validates all inputs, the frontend should:

- Use strict types (TypeScript).
- Use runtime validation (e.g., `zod`) to catch invalid inputs immediately and provide a good user experience.

## 5. Avoiding Information Leakage

Ensure error boundaries and API error interceptors do not leak stack traces or sensitive backend paths to the user interface in production.
