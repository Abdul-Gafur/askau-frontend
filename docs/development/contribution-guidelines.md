# AskAU Frontend Contribution Guidelines

This document outlines the workflow and requirements for contributing to the AskAU Frontend repository.

## 1. Repository Setup

1. Clone the repository locally.
2. Ensure you have **Node.js 24+** and **pnpm 9+** installed.
3. Run `pnpm install` to install all dependencies.
4. Duplicate `.env.example` to `.env.local` and configure your local variables. (Do not commit `.env.local`).

## 2. Branching Strategy

We use a **Git Flow** approach built around pull requests. Direct pushes to core branches are strictly prohibited.

- `main`: Production-ready code. **Direct pushes are restricted.** Code must be merged from `develop` via a Pull Request.

- `develop`: The active integration branch for the next release. **Direct pushes are restricted.** All daily work must be merged here via a Pull Request from a feature branch.

- `feature/*`: New features or components (e.g., `feature/chat-input`). Include issue IDs when applicable (e.g., `feat/john/ASK-12-chat`).
- `fix/*`: Bug fixes (e.g., `fix/sidebar-overflow`).
- `docs/*`: Documentation updates.

**Important Guidelines**:

- **One screen/feature per branch, one branch per pull request.** Do not bundle multiple unrelated features into a single PR.

## 3. Commit Conventions

We strictly follow [Conventional Commits](https://www.conventionalcommits.org/).

**Format**: `<type>: <description>`

**Allowed Types**:

- `feat:` A new feature.
- `fix:` A bug fix.
- `docs:` Documentation only changes.
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, etc).
- `refactor:` A code change that neither fixes a bug nor adds a feature.
- `perf:` A code change that improves performance.
- `test:` Adding missing tests or correcting existing tests.
- `chore:` Changes to the build process or auxiliary tools and libraries.

**Examples**:

- `feat: add chat feature`
- `fix: correct mobile navigation`
- `refactor: simplify API client`
- `docs: update architecture`
- `test: add citation tests`

## 4. Pull Requests (PRs)

**Pre-Push Checks:** Before pushing your branch to GitHub, you **must** run the following commands locally and fix any errors. This prevents broken builds and CI pipeline failures:

- `pnpm lint` (Checks code style and formatting)
- `pnpm typecheck` (Ensures TypeScript compiles)
- `pnpm format:check` (Checks code formatting)
- `pnpm test` (Runs the test suite)
- `pnpm build` (Verifies the production build succeeds)

All changes must go through a Pull Request.

1. **Create the PR** against the `develop` branch (or `main` for hotfixes). Push your branch early — even half-finished — and open it as a **draft PR**.
2. **Title the PR**: Include the issue ID or wireframe ID in the title (e.g., `feat(chat): ASK-12 Chat interface`).
3. **Provide summary of changes in the PR Description**.
4. **Visual Changes**: If your PR includes UI changes, include screenshots of the screen in the description for both **light and dark modes**.

## 5. Code Review Requirements

Every PR requires at least **one approval** from a core maintainer before merging.

Reviewers will check for:

- Adherence to the feature-oriented architecture.
- Proper use of server vs. client components.
- Avoidance of business logic in UI components.
- No direct calls to LLMs or databases (must use the AskAU Platform API).

## 6. Development Guidelines

### Server and Client Components

- Pages should remain **server components**.
- All interactivity (filters, search, tabs, dialogs) lives one level down, in `"use client"` components inside your feature folder. This keeps routes statically renderable across locales.
- Anything time-dependent (like relative timestamps) must be resolved on the server and passed down as a formatted string to avoid hydration mismatches.

### Component Boundaries

Respect the following import hierarchy. Imports run downwards only:

1. `features/`: Feature-specific domain code.
2. `layout/`: Application shell.
3. `common/`: App-wide blocks composed from `ui/`.
4. `ui/`: Radix/shadcn primitives.

**No feature folder imports from another feature folder.** If you find yourself wanting something from someone else's folder, that is a signal the piece belongs in `common/`.

### Data Fetching

- Create a `<feature>-data.ts` module in your feature folder that returns the real domain types with placeholder values (until the API is ready).
- Filter client-side over a list the server has already sent (when applicable).

## 6. Testing

- All new features and bug fixes **must** include corresponding tests.
- Unit tests (`vitest`) for utilities, hooks, and complex logic.
- Integration tests (`React Testing Library`) for interactive components.
- Smoke/E2E tests (`Playwright`) for critical user flows.
- Ensure `pnpm test` passes locally before pushing.

## 7. Security Review

- **No Secrets**: Ensure no API keys, tokens, or sensitive URLs are hardcoded.
- **Client/Server Boundaries**: Validate that server-only code (e.g., database fetching, token generation) is not exposed to the client. Use Next.js "use server" carefully.
- **Threat Mitigation**: Ensure inputs are sanitized and React's built-in escaping is not bypassed (avoid `dangerouslySetInnerHTML`).

## 8. Accessibility Review

- Ensure all new interactive elements are keyboard navigable.
- Validate ARIA labels on buttons and inputs.
- Ensure color contrast meets WCAG 2.2 AA standards.
- Test focus management for modals and sidebars.

## 9. i18n & RTL Review

- **No Hardcoded Strings**: Every user-facing text must use `next-intl` (`t('key')`).
- **RTL Support**: Arabic is a fully supported language. Ensure you use CSS logical properties (`margin-inline-start`, `padding-block`) instead of physical properties (`margin-left`, `padding-top`).
- Test your PR by switching the language to Arabic and verifying the layout mirrors correctly.

## 10. Dark Mode Review

- All UI components must support both Light and Dark modes.
- Use the semantic design tokens defined in `globals.css` (e.g., `bg-background`, `text-primary`). Do not use raw colors (e.g., `bg-blue-500`) unless explicitly required.
- Test your PR by toggling the theme in the UI.

## 11. Dependency Changes

- Do not add new dependencies without strong justification.
- If a dependency is added, it must be documented in the PR description.
- Avoid adding heavy client-side libraries.

## 12. Breaking Changes

- If your PR introduces a breaking change (e.g., modifying a shared component's props, altering a global type), prefix your commit message with `BREAKING CHANGE:`.
- Ensure all downstream consumers of the modified code are updated in the same PR.

## 13. Definition of Done

A feature is finished when every one of these is true. Please run through this list before requesting review:

- [ ] Locale guard is in place and `generateMetadata` is correctly configured.
- [ ] Every user-visible string comes from the dictionary (no hard-coded strings).
- [ ] The page is a server component; interactivity lives in `"use client"` feature components.
- [ ] Data comes from a structured data module returning real domain types.
- [ ] Existing components are reused; nothing was rebuilt that already existed in `ui/` or `common/`.
- [ ] Import direction is respected, with no cross-feature imports.
- [ ] Loading, error, and empty states are handled properly.
- [ ] Checked in **dark mode**.
- [ ] Checked in **Arabic** — layout must not break under RTL.
- [ ] Checked at mobile width (responsive).
- [ ] Keyboard navigable, accessible, and all icon-only buttons have accessible names.
- [ ] `pnpm build`, `pnpm lint`, and `pnpm typecheck` all pass locally.
