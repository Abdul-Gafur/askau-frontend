# Testing Strategy

We maintain a high standard for testing to ensure the stability of the AskAU platform. Our testing strategy relies on three main layers.

## 1. Unit Testing (Vitest)

Used for testing pure functions, custom hooks, and utility methods in isolation.

- **Tool:** [Vitest](https://vitest.dev/)
- **When to use:** Whenever you write a complex utility function, a data transformation helper, or a custom hook.
- **How to run:** `pnpm test`
- **File naming:** `*.test.ts` or `*.spec.ts`

## 2. Integration Testing (React Testing Library)

Used for testing React components to ensure they render correctly and respond to user interactions as expected.

- **Tool:** [React Testing Library (RTL)](https://testing-library.com/docs/react-testing-library/intro/)
- **When to use:** For complex UI components, especially those with interactivity, form validation, and complex state.
- **How to run:** `pnpm test`
- **Focus:** Test behavior, not implementation details. Query elements by their accessible roles (e.g., `getByRole('button', { name: /submit/i })`).

## 3. End-to-End (E2E) Testing (Playwright)

Used for testing complete user flows from end to end, running in a real browser.

- **Tool:** [Playwright](https://playwright.dev/)
- **When to use:** For critical user journeys (e.g., Logging in, Submitting a prompt to the LLM, Changing languages).
- **How to run:** `pnpm test:e2e` (requires local environment to be running).

## Testing Best Practices

- **Test Accessibility:** Use `jest-axe` in RTL tests to catch accessibility regressions automatically.
- **Mocking APIs:** Use MSW (Mock Service Worker) for mocking backend API responses during integration testing, avoiding actual network calls.
- **Avoid Testing Implementation Details:** Do not assert on internal state or specific CSS classes unless necessary.