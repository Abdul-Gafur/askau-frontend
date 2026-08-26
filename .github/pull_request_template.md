## Pull Request

### Description
<!-- Clearly describe what this PR does and why. -->

### Type of Change
- [ ] Feature (`feat:`)
- [ ] Bug fix (`fix:`)
- [ ] Refactor (`refactor:`)
- [ ] Documentation (`docs:`)
- [ ] Test (`test:`)
- [ ] Chore / dependency update (`chore:`)
- [ ] Security (`security:`)
- [ ] Performance (`perf:`)

### Related Issues
<!-- Link related issues: Closes #123 -->

---

## Checklist

### Architecture & Code Quality
- [ ] Code follows the feature-oriented architecture (`features/`, `components/`, `lib/`)
- [ ] No business logic embedded directly in UI components
- [ ] No direct access to LLMs, databases, or infrastructure from the frontend
- [ ] No unnecessary abstractions introduced

### TypeScript
- [ ] No `any` types introduced without justification
- [ ] All new functions and components have appropriate type annotations
- [ ] `pnpm typecheck` passes

### Lint & Format
- [ ] `pnpm lint` passes
- [ ] `pnpm format:check` passes

### Security
- [ ] No secrets, tokens, or credentials committed
- [ ] No sensitive data logged
- [ ] No internal infrastructure details exposed to the client
- [ ] Frontend auth checks are marked as UX-only (backend is authoritative)
- [ ] New environment variables documented in `.env.example`

### Accessibility (WCAG 2.2 AA)
- [ ] Semantic HTML elements used
- [ ] Interactive elements have accessible labels (`aria-label`, `aria-labelledby`)
- [ ] Focus management is correct
- [ ] `aria-current="page"` used for active navigation items
- [ ] Color contrast meets AA requirements
- [ ] No accessibility-only font size changes (minimum 16px body)

### Internationalization
- [ ] No hard-coded user-facing strings (use translation keys)
- [ ] New translation keys added to all 4 locale files (en, fr, ar, pt)
- [ ] RTL layout tested for Arabic (`dir="rtl"`)
- [ ] CSS logical properties used (not physical: `margin-left`, `padding-right`)

### Dark Mode
- [ ] All new UI components tested in light mode
- [ ] All new UI components tested in dark mode
- [ ] Semantic color tokens used (not hard-coded colors)

### Testing
- [ ] Unit tests written for new logic
- [ ] `pnpm test` passes
- [ ] E2E smoke test still passes (if routing changed)

### Documentation
- [ ] Component documented with JSDoc if non-trivial
- [ ] Architecture documentation updated if patterns changed
- [ ] ADR created if a significant architectural decision was made
- [ ] `docs/changelog.md` updated

---

## Screenshots / Recordings
<!-- Attach screenshots for UI changes (light + dark mode) -->

---

## Breaking Changes
<!-- List any breaking changes. If none, write "None." -->
