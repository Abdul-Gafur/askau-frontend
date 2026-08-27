# AskAU Frontend Threat Model

This document identifies potential security threats specific to the AskAU frontend application and details the mitigations implemented to address them.

> **Crucial Principle**: The AskAU frontend is a presentation layer only. It is never trusted by the AskAU backend. The backend is the sole authoritative source for authentication verification, authorization decisions, and data filtering.

## 1. Authentication & Authorization Bypass

**Threat**: An attacker attempts to bypass frontend routing guards to access protected pages (e.g., `/chat`, `/admin`) without a valid session, or attempts to view content they lack permissions for.
**Mitigation**:

- **Next.js Middleware**: Edge middleware intercepts all requests to protected routes and verifies the existence of a valid NextAuth session before rendering the page.
- **Backend Authority**: Even if an attacker circumvents the frontend router, the AskAU backend API strictly validates the Bearer token (JWT/Session) on every request. Unauthorized API requests will return 401/403, rendering the frontend page useless as it cannot fetch data.
- **UX-Only Guards**: Frontend role checks (e.g., checking if a user is an 'admin' to show a settings button) are treated purely as UX enhancements, not security boundaries.

## 2. Cross-Site Scripting (XSS)

**Threat**: An attacker injects malicious JavaScript into the application, typically through AI-generated responses, chat history, or document citations. If executed, the script could steal session tokens or perform actions on behalf of the user.
**Mitigation**:

- **React Auto-Escaping**: React automatically escapes all string variables rendered in JSX, neutralizing standard HTML/JS injection.
- **No `dangerouslySetInnerHTML`**: The use of `dangerouslySetInnerHTML` is strictly prohibited unless parsing trusted, sanitized markdown using a heavily restricted markdown parser (e.g., `react-markdown` with strict plugins).
- **Content Security Policy (CSP)**: A strict CSP is enforced via Next.js headers to restrict the sources from which scripts, styles, and images can be loaded, preventing the execution of inline scripts and unauthorized external scripts.

## 3. Cross-Site Request Forgery (CSRF)

**Threat**: An attacker tricks a user's browser into executing an unwanted action on the AskAU platform while the user is authenticated.
**Mitigation**:

- **NextAuth.js Protection**: NextAuth.js inherently protects against CSRF for its own endpoints (login, logout) using CSRF tokens and `SameSite=Lax` cookies.
- **API Token Transport**: API requests to the AskAU backend use the Authorization header (`Bearer <token>`) rather than cookies. CSRF attacks rely on the browser automatically attaching cookies to cross-origin requests; by using Bearer tokens, the frontend explicitly attaches the credential, rendering standard CSRF impossible against the backend APIs.

## 4. Sensitive Data Exposure

**Threat**: Sensitive information (API keys, Entra ID client secrets, AI provider keys) is leaked to the browser or committed to source control.
**Mitigation**:

- **Next.js Env Prefix**: Only environment variables explicitly prefixed with `NEXT_PUBLIC_` are included in the client-side JavaScript bundle.
- **Server-Only Secrets**: All NextAuth secrets (`NEXTAUTH_SECRET`) and Entra ID credentials (`ENTRA_CLIENT_SECRET`) omit the prefix and remain strictly on the Node.js server.
- **No Infrastructure Access**: The frontend NEVER connects directly to LLMs, vector databases, or internal AU Commission systems. It only connects to the AskAU Platform API, ensuring infrastructure credentials are never needed in the frontend repository.
- **Secret Scanning**: GitHub Actions run TruffleHog on every PR to detect accidentally committed secrets.

## 5. Denial of Service (DoS) at the UI Layer

**Threat**: The frontend is overwhelmed by excessive requests, or a malicious actor triggers heavy client-side processing (e.g., rendering massive chat histories) that crashes the browser.
**Mitigation**:

- **Pagination & Virtualization**: Chat histories and document lists are paginated. If lists grow exceptionally large, windowing/virtualization will be employed.
- **API Rate Limiting**: The backend enforces rate limits. The frontend `ApiClient` gracefully handles `429 Too Many Requests` responses, backing off and displaying user-friendly error messages without looping infinitely.

## 6. Dependency Vulnerabilities (Supply Chain)

**Threat**: A third-party NPM package introduces a known vulnerability or malicious code.
**Mitigation**:

- **Minimal Dependencies**: The project strictly follows the principle of minimal dependencies.
- **Automated Audits**: `pnpm audit` runs in the CI/CD pipeline.
- **Dependabot**: Automated dependency updates and security alerts are enabled on the repository.
