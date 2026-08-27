# Frontend Security Model

The frontend is built on the principle of **Defense in Depth**, but it explicitly acknowledges that **the backend is the ultimate source of truth for security and authorization**.

## 1. Authentication

- Authentication is managed via NextAuth.js integrating with Microsoft Entra ID.
- Tokens (JWTs) are securely stored. The Next.js server handles the OAuth dance, ensuring client-side code does not have direct access to sensitive refresh tokens if possible.
- API requests include the access token injected securely by the API Client.

## 2. Authorization (UX-Level)

- The frontend uses roles and permissions to hide or disable UI elements (e.g., hiding the "Admin Panel" button).
- **Rule:** Frontend role-checks are purely for UX. The backend API must independently verify all permissions on every request.

## 3. Data Validation & Sanitization

- **No trust:** We do not trust user input. While the backend performs strict validation, the frontend uses libraries like `zod` for immediate UX validation in forms.
- **XSS Prevention:** React automatically escapes data before rendering it to the DOM.
- **Rule:** Never use `dangerouslySetInnerHTML` unless rendering strictly sanitized markdown from a trusted backend source (using DOMPurify).

## 4. Environment Variables

- **Secrets:** Keys starting without `NEXT_PUBLIC_` are secure server-side variables and are never bundled to the client.
- **Public:** Only harmless variables (like API base URLs) should be prefixed with `NEXT_PUBLIC_`.

## 5. Security Headers

Next.js is configured (via `next.config.ts`) to inject secure HTTP headers, including:
- **Content Security Policy (CSP)**
- **Strict-Transport-Security (HSTS)**
- **X-Frame-Options (DENY)**
- **X-Content-Type-Options (nosniff)**