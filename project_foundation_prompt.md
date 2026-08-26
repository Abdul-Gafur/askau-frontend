You are a Senior Staff Frontend Engineer, Enterprise Architect, Security Engineer, and UI/UX Engineer.

Your task is to CREATE and IMPLEMENT the production-grade FRONTEND FOUNDATION for the AskMe platform.

============================================================
IMPORTANT SCOPE
============================================================

THIS IS FOUNDATION AND PROJECT STRUCTURING PHASE.

Do NOT implement the complete AskMe chatbot UI yet.

Do NOT implement the complete chat experience.

Do NOT implement RAG.

Do NOT integrate an LLM.

Do NOT integrate vector databases.

Do NOT implement document retrieval.

Do NOT implement real AI responses.

Do NOT implement streaming chat responses.

Do NOT implement agent functionality.

Do NOT integrate MIS or other Organisation enterprise systems.

Do NOT build production business functionality that belongs to the future backend/platform.

The objective of this phase is to establish a strong, production-grade frontend foundation that the next implementation phase can build upon.

You must actually CREATE the project and files.

Do not merely describe the architecture.

============================================================
1. PROJECT OVERVIEW
============================================================

Project Name:

AskMe Frontend

Repository:

AskMe-frontend

AskMe is an enterprise AI knowledge assistant for the African Union Commission (Organisation).

The initial version of AskMe is a secure Retrieval-Augmented Generation (RAG) chatbot that allows authenticated Organisation faculty and staff to ask natural-language questions about approved Organisation organizational knowledge.

AskMe should eventually provide answers grounded strictly in approved Organisation knowledge sources, such as:

- Policies
- Procedures
- SOPs
- Guidelines
- Manuals
- Circulars
- FAQs
- Reports
- Official organizational documents

Answers should provide references/citations to the underlying source documents whenever available.

The frontend is intentionally maintained as a SEPARATE REPOSITORY from the AskMe backend/platform monorepo.

The frontend must communicate with the backend through documented APIs.

The frontend must NEVER directly communicate with:

- LLM providers
- Vector databases
- Embedding providers
- PostgreSQL
- Redis
- Document repositories
- Internal Organisation systems

Those responsibilities belong to the AskMe platform/backend.

============================================================
2. LONG-TERM PRODUCT DIRECTION
============================================================

The initial AskMe release is RAG-based.

AskMe is expected to evolve into an enterprise AI agent platform.

Future capabilities may include:

- Interacting with Organisation internal systems
- Retrieving information from enterprise systems
- Performing approved operations
- Executing tools
- Creating requests
- Updating records
- Submitting workflows
- Human approval before sensitive actions
- Multi-step tasks
- Microsoft 365 integration
- MIS integration
- Other Organisation enterprise system integrations

The frontend must therefore be designed so future agent functionality can be introduced without requiring a complete frontend rewrite.

Do NOT implement the agent functionality now.

Create clean architectural boundaries that allow future capabilities.

============================================================
3. CORE TECHNOLOGY STACK
============================================================

Use the following technology stack unless there is a compelling technical reason to deviate.

Frontend:

- Next.js
- React
- TypeScript
- Next.js App Router
- Tailwind CSS
- shadcn/ui

State and data:

- TanStack Query
- React state where appropriate
- React Context only where justified

Forms and validation:

- React Hook Form
- Zod

Authentication:

- Microsoft Entra ID
- Use an appropriate Microsoft-supported or well-maintained authentication approach compatible with Next.js.

Testing:

- Vitest
- React Testing Library
- Playwright

Code quality:

- ESLint
- Prettier
- TypeScript strict mode

Package manager:

- pnpm

API:

- REST/HTTPS initially
- OpenAPI-compatible API contract

Do not install unnecessary libraries.

Before adding any dependency, determine whether it is genuinely required.

If a dependency is introduced, document why it was selected.

============================================================
4. ARCHITECTURAL PRINCIPLES
============================================================

Follow these principles throughout the project.

1. Production-grade architecture.
2. Security-first.
3. Privacy-first.
4. Accessibility-first.
5. Internationalization-first.
6. Feature-oriented architecture.
7. Strong type safety.
8. Separation of concerns.
9. API-first backend integration.
10. Independent frontend deployment.
11. Reusable components.
12. Testable code.
13. Maintainable code.
14. Minimal unnecessary abstraction.
15. Avoid premature complexity.
16. No direct infrastructure access from the frontend.
17. No secrets in client-side code.
18. Business logic must not be unnecessarily embedded inside UI components.
19. Documentation must remain synchronized with implementation.
20. Follow current official Next.js and React best practices.

============================================================
5. REPOSITORY STRUCTURE
============================================================

Create the project using the following structure.

AskMe-frontend/
│
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   └── unauthorized/
│   │       └── page.tsx
│   │
│   ├── (protected)/
│   │   ├── layout.tsx
│   │   │
│   │   ├── chat/
│   │   │   └── page.tsx
│   │   │
│   │   ├── conversations/
│   │   │   └── page.tsx
│   │   │
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── admin/
│   │   └── page.tsx
│   │
│   ├── api/
│   │   └── health/
│   │       └── route.ts
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── chat/
│   ├── citations/
│   ├── conversations/
│   ├── feedback/
│   ├── loading/
│   └── errors/
│
├── features/
│   ├── authentication/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── schemas/
│   │   └── utils/
│   │
│   ├── chat/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── schemas/
│   │   └── utils/
│   │
│   ├── conversations/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── citations/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   │
│   ├── feedback/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   │
│   └── settings/
│       ├── components/
│       ├── hooks/
│       └── services/
│
├── i18n/
│   ├── config.ts
│   ├── routing.ts
│   ├── utils.ts
│   └── locales/
│       ├── en/
│       │   ├── common.json
│       │   ├── navigation.json
│       │   ├── chat.json
│       │   ├── citations.json
│       │   ├── errors.json
│       │   ├── settings.json
│       │   └── auth.json
│       │
│       ├── fr/
│       ├── ar/
│       └── pt/
│
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── errors.ts
│   │   ├── types.ts
│   │   └── interceptors.ts
│   │
│   ├── auth/
│   │   ├── config.ts
│   │   ├── session.ts
│   │   └── permissions.ts
│   │
│   ├── validation/
│   ├── security/
│   ├── logger/
│   └── utils/
│
├── hooks/
│   ├── use-debounce.ts
│   ├── use-media-query.ts
│   ├── use-mounted.ts
│   └── use-theme.ts
│
├── types/
│   ├── api.ts
│   ├── auth.ts
│   ├── chat.ts
│   ├── citation.ts
│   ├── conversation.ts
│   └── common.ts
│
├── config/
│   ├── site.ts
│   ├── navigation.ts
│   └── environment.ts
│
├── styles/
│   ├── globals.css
│   ├── themes.css
│   └── tokens.css
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── accessibility/
│   └── e2e/
│
├── docs/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── security.yml
│   │   └── build.yml
│   ├── pull_request_template.md
│   └── ISSUE_TEMPLATE/
│
├── .env.example
├── .gitignore
├── .editorconfig
├── .prettierrc
├── eslint.config.*
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
└── README.md

Do not create unnecessary directories simply to make the project appear enterprise-grade.

If a directory does not yet have meaningful content, create only what is necessary to establish the intended architectural boundary.

============================================================
6. FRONTEND RESPONSIBILITY BOUNDARY
============================================================

The frontend is responsible for:

- User interface
- Authentication experience
- Conversation experience
- API communication
- Rendering AI responses
- Rendering citations
- User preferences
- Accessibility
- Internationalization
- Theme management
- Client-side validation
- User feedback
- Error handling

The frontend is NOT responsible for:

- RAG
- Embeddings
- Vector search
- Document ingestion
- Document parsing
- OCR
- LLM calls
- Production backend prompt execution
- Database access
- Enterprise system integration
- Agent execution
- Tool execution
- Backend authorization decisions

The backend/platform remains authoritative for these functions.

============================================================
7. APPLICATION ARCHITECTURE
============================================================

Use the following conceptual architecture:

Presentation Layer
        ↓
Feature Layer
        ↓
Application Services
        ↓
API Client
        ↓
AskMe Platform API

Example:

User
 ↓
Next.js UI
 ↓
Feature
 ↓
Service
 ↓
Typed API Client
 ↓
AskMe Platform

Document retrieval, RAG, LLM and enterprise system operations remain entirely behind the platform API.

============================================================
8. AUTHENTICATION FOUNDATION
============================================================

AskMe is an enterprise Organisation application.

Authentication shall use Microsoft Entra ID.

During this foundation phase:

- Establish the authentication architecture.
- Establish configuration boundaries.
- Establish session abstraction.
- Establish route protection boundaries.
- Establish permission abstraction.
- Create login UI foundation.
- Create logout mechanism/interface where appropriate.
- Create unauthorized state.
- Document the future Entra ID integration.

Do NOT connect to a real Organisation production tenant unless explicitly instructed and the required configuration is available.

Never hard-code:

- Tenant ID
- Client ID
- Client secret
- Tokens
- Credentials

Use environment configuration.

Never expose server-side secrets to the browser.

Do not use NEXT_PUBLIC_* for secrets.

Document which configuration values are client-safe and which must remain server-side.

============================================================
9. SECURITY & PRIVACY FOUNDATION
============================================================

Security and privacy are first-class requirements.

The frontend must:

- Use HTTPS in production.
- Avoid exposing secrets.
- Avoid storing sensitive information unnecessarily.
- Avoid logging sensitive information.
- Avoid exposing authentication tokens unnecessarily.
- Validate untrusted input.
- Safely render future Markdown/HTML content.
- Prevent XSS.
- Implement secure headers where applicable.
- Establish Content Security Policy where practical.
- Handle API errors safely.
- Avoid leaking backend implementation details.
- Avoid leaking document permissions.
- Never expose unauthorized source documents.
- Respect backend authorization.

IMPORTANT:

The frontend must NEVER treat hidden UI elements as an authorization mechanism.

Backend authorization is authoritative.

Document this clearly.

Create:

docs/security/security-guidelines.md

docs/security/threat-model.md

docs/architecture/frontend-security.md

============================================================
10. API ARCHITECTURE FOUNDATION
============================================================

The frontend must communicate with the AskMe platform through APIs.

Create:

lib/api/client.ts

The API architecture should support:

- Authentication context
- Request handling
- Response parsing
- Error handling
- Timeout handling
- Request cancellation
- Retry behavior where appropriate
- Streaming-ready response handling

Do not implement real AI/RAG API calls in this phase.

Prepare typed models for:

- User
- Conversation
- Message
- Citation
- ChatRequest
- ChatResponse
- Feedback
- APIError
- Pagination

Do not invent large numbers of backend endpoints.

Create only the frontend-facing contract required by the planned application.

Document the API contract.

Use OpenAPI-compatible structures where possible.

============================================================
11. MOCK API FOUNDATION
============================================================

Because the real AskMe backend may not yet be available, establish a clean development mock layer.

Mock functionality must be:

- Clearly separated from production API code.
- Easy to replace with real API calls.
- Configuration-controlled.
- Clearly documented as development-only.

Do not allow mock data to become accidentally embedded into production logic.

Document:

Development/mock mode

versus:

Production API mode.

============================================================
12. DESIGN SYSTEM FOUNDATION
============================================================

Use:

Tailwind CSS
+
shadcn/ui

Establish:

- Design tokens
- Typography
- Spacing
- Border radius
- Shadows
- Semantic colors
- Surface colors
- Focus styles
- Responsive breakpoints

Create reusable base components where appropriate.

At minimum establish:

- Button
- Input
- Textarea
- Select
- Dropdown
- Dialog
- Sheet
- Tabs
- Card
- Alert
- Toast
- Tooltip
- Avatar
- Skeleton
- Badge

Generic UI primitives belong in:

components/ui/

AskMe-specific components belong in their feature/domain folders.

============================================================
13. DARK MODE FOUNDATION
============================================================

Dark mode is required.

Support:

- Light
- Dark
- System

Establish the theme architecture now.

Persist user preference appropriately.

Prevent flash of incorrect theme.

Use semantic design tokens.

Ensure all base components support:

Light mode
and
Dark mode.

============================================================
14. MULTILINGUAL FOUNDATION
============================================================

Multilingual support is required from the beginning.

Initial languages:

1. English — en
2. French — fr
3. Arabic — ar
4. Portuguese — pt

English is the initial default.

Do not hard-code user-facing text inside reusable components.

Use translation keys.

Create translation structures for:

- common
- navigation
- chat
- citations
- errors
- settings
- authentication

The architecture must allow future languages to be added without rewriting application logic.

============================================================
15. RTL FOUNDATION
============================================================

Arabic requires RTL support.

English:
LTR

French:
LTR

Portuguese:
LTR

Arabic:
RTL

Use:

lang

and:

dir

appropriately.

Prefer CSS logical properties:

margin-inline
padding-inline
inset-inline
border-inline
text-align: start
text-align: end

Do not manually reverse layouts throughout components.

Establish the RTL architecture during this phase.

============================================================
16. ACCESSIBILITY FOUNDATION
============================================================

Target:

WCAG 2.2 AA

Establish accessibility standards for the entire project.

Include:

- Semantic HTML
- Keyboard navigation
- Focus management
- Visible focus indicators
- Screen-reader support
- Appropriate ARIA
- Accessible forms
- Accessible dialogs
- Accessible navigation
- Sufficient color contrast
- Reduced motion
- Accessible loading states
- Accessible error states

Document accessibility requirements.

============================================================
17. TYPOGRAPHY FOUNDATION
============================================================

Select typography that supports:

- English
- French
- Portuguese
- Arabic

The font strategy must render Arabic properly.

Test representative characters.

Document the typography decision in an ADR.

============================================================
18. STATE MANAGEMENT FOUNDATION
============================================================

Do not use Redux unless a genuine requirement emerges.

Prefer:

React state
+
TanStack Query
+
Context only where justified.

Use TanStack Query for server state.

Use local state for component-specific UI state.

Use URL state where appropriate.

Do not create a global store without a genuine requirement.

============================================================
19. FORMS & VALIDATION FOUNDATION
============================================================

Use:

React Hook Form
+
Zod

for complex forms.

Establish validation conventions.

Client-side validation must never replace backend validation.

============================================================
20. ERROR HANDLING FOUNDATION
============================================================

Establish a consistent error strategy.

Support conceptual states for:

- Network failure
- API unavailable
- Authentication failure
- Authorization failure
- Validation error
- Timeout
- Rate limiting
- Server error
- Unknown error

Never expose:

- Stack traces
- Internal exceptions
- Database information
- Infrastructure details
- Tokens
- Secrets
- Internal service names

============================================================
21. LOGGING FOUNDATION
============================================================

Create a safe frontend logging abstraction.

Do not log:

- Passwords
- Access tokens
- Refresh tokens
- Sensitive user information
- Confidential documents
- Full sensitive chat content unnecessarily

Differentiate development logging from production logging.

Document logging rules.

============================================================
22. TESTING FOUNDATION
============================================================

Configure:

- Vitest
- React Testing Library
- Playwright

Establish:

tests/
├── unit/
├── integration/
├── accessibility/
└── e2e/

Create initial meaningful tests for:

- Application startup
- Basic component rendering
- Theme foundation
- Language foundation
- RTL foundation
- Authentication boundary
- Protected route boundary
- API client behavior
- Error handling

Create an initial Playwright smoke test.

Do not create meaningless tests simply to increase coverage.

============================================================
23. CI/CD FOUNDATION
============================================================

Create:

.github/workflows/

ci.yml
security.yml
build.yml

CI should eventually verify:

1. Dependencies
2. TypeScript
3. ESLint
4. Formatting
5. Unit tests
6. Accessibility tests where practical
7. E2E smoke tests where practical
8. Production build
9. Security/dependency checks

Do not configure deployment to a real Organisation production environment.

============================================================
24. ENVIRONMENT CONFIGURATION
============================================================

Create:

.env.example

Clearly separate:

- Client-safe configuration
- Server-only configuration

Never place secrets under:

NEXT_PUBLIC_*

Never commit:

.env
.env.local
.env.production

or any other secret-bearing environment file.

============================================================
25. DOCUMENTATION STRUCTURE
============================================================

Create:

docs/
├── README.md
│
├── architecture/
│   ├── overview.md
│   ├── frontend-architecture.md
│   ├── frontend-data-flow.md
│   └── frontend-security.md
│
├── api/
│   ├── api-integration.md
│   └── api-contract.md
│
├── authentication/
│   └── entra-id.md
│
├── i18n/
│   ├── README.md
│   ├── supported-languages.md
│   ├── translation-guidelines.md
│   └── rtl-guidelines.md
│
├── theming/
│   ├── README.md
│   ├── dark-mode.md
│   └── design-tokens.md
│
├── development/
│   ├── setup.md
│   ├── coding-standards.md
│   ├── component-guidelines.md
│   ├── contribution-guidelines.md
│   └── testing.md
│
├── deployment/
│   └── deployment.md
│
├── security/
│   ├── security-guidelines.md
│   └── threat-model.md
│
├── accessibility/
│   └── wcag.md
│
├── decisions/
│   ├── README.md
│   ├── ADR-001-separate-frontend-repository.md
│   ├── ADR-002-nextjs-react.md
│   ├── ADR-003-typescript.md
│   ├── ADR-004-feature-architecture.md
│   ├── ADR-005-api-first.md
│   ├── ADR-006-entra-id.md
│   ├── ADR-007-shadcn-tailwind.md
│   ├── ADR-008-tanstack-query.md
│   ├── ADR-009-internationalization.md
│   ├── ADR-010-rtl.md
│   ├── ADR-011-theming.md
│   └── ADR-012-accessibility.md
│
└── changelog.md

============================================================
26. CODING STANDARDS
============================================================

Create:

docs/development/coding-standards.md

Cover:

- TypeScript
- React
- Next.js
- Components
- Naming conventions
- File naming
- Folder naming
- Feature organization
- Imports
- Tailwind
- shadcn/ui
- State management
- API calls
- Validation
- Error handling
- Security
- Accessibility
- i18n
- RTL
- Dark mode
- Performance
- Testing
- Comments
- Documentation
- Environment variables
- Dependencies

Provide:

GOOD

and:

AVOID

examples.

============================================================
27. CONTRIBUTION GUIDELINES
============================================================

Create:

docs/development/contribution-guidelines.md

Define:

- Repository setup
- Branching
- Commit conventions
- Pull requests
- Code review
- Testing
- Documentation
- Security review
- Accessibility review
- i18n review
- RTL review
- Dark mode review
- Dependency changes
- Breaking changes

Use Conventional Commits.

Examples:

feat: add chat feature
fix: correct mobile navigation
refactor: simplify API client
docs: update architecture
test: add citation tests
chore: update dependencies
security: improve content sanitization

============================================================
28. CODE REVIEW CHECKLIST
============================================================

Create a suitable code review checklist covering:

- Architecture
- TypeScript
- React
- Next.js
- Security
- Accessibility
- i18n
- RTL
- Dark mode
- Performance
- Testing
- API boundaries
- Documentation

============================================================
29. ARCHITECTURE DOCUMENTATION
============================================================

Document:

Presentation
↓
Features
↓
Services
↓
API Client
↓
AskMe Platform

Also document what the frontend does NOT own.

Use Mermaid diagrams.

All diagrams must:

- Use straight lines.
- Avoid curved lines.
- Avoid unnecessary crossing lines.
- Group related components.
- Have clear labels.
- Be readable.
- Use logical top-to-bottom or left-to-right flow.

============================================================
30. ADRs
============================================================

Each ADR must contain:

- Status
- Context
- Decision
- Alternatives considered
- Consequences

Do not fabricate Organisation policies or technical decisions that have not actually been approved.

Where a technology decision is based on an engineering recommendation, clearly identify it as an architectural decision for this project.

============================================================
31. CHANGELOG
============================================================

Create:

docs/changelog.md

Use:

## [Unreleased]

### Added

### Changed

### Fixed

### Security

### Documentation

============================================================
32. README
============================================================

Create a professional README containing:

- Project overview
- AskMe purpose
- Current implementation phase
- Architecture
- Technology stack
- Prerequisites
- Installation
- Environment configuration
- Development
- Testing
- Build
- Documentation
- Security
- Accessibility
- Internationalization
- Contribution

Clearly state:

"This repository is currently establishing the AskMe frontend foundation."

============================================================
33. GIT WORKFLOW
============================================================

Create:

main
develop

Feature branches should follow:

feature/chat-interface
feature/authentication
feature/citations
feature/i18n
feature/dark-mode

Use Conventional Commits.

Create:

.github/pull_request_template.md

Require:

- Description
- Changes
- Testing
- Security considerations
- Accessibility considerations
- Internationalization considerations
- Documentation updates
- Breaking changes

============================================================
34. FUTURE AGENT COMPATIBILITY
============================================================

Do NOT implement agents.

However, ensure the frontend architecture can eventually represent:

- Tool execution
- Task progress
- Action confirmation
- Human approval
- Multi-step operations
- Enterprise system results
- Action history
- Permission prompts

Do not implement these now.

============================================================
35. PERFORMANCE FOUNDATION
============================================================

Follow modern Next.js performance practices.

Pay attention to:

- Server/client component boundaries
- Bundle size
- Lazy loading
- Code splitting
- Image optimization
- Font optimization
- Caching
- Unnecessary rendering
- Component size

Prefer Server Components by default.

Use Client Components only where interactivity requires them.

============================================================
36. RESPONSIVE FOUNDATION
============================================================

The application must support:

- Desktop
- Laptop
- Tablet
- Mobile

Desktop is the primary enterprise environment.

Establish responsive layout conventions.

============================================================
37. PRIVACY
============================================================

Treat AskMe conversations as potentially sensitive enterprise information.

The frontend should minimize unnecessary persistence.

Do not store complete conversations in localStorage by default.

Do not expose chat content through analytics.

Do not introduce third-party tracking libraries without explicit approval and privacy/security assessment.

Document these principles.

============================================================
38. MINIMAL UI SHELL ONLY
============================================================

Create ONLY enough UI to verify the foundation.

Implement:

- Application shell
- Header
- Sidebar/navigation foundation
- Theme selector
- Language selector
- User menu placeholder
- Login page foundation
- Unauthorized page
- Protected route placeholder
- Basic settings page shell
- Basic chat page placeholder

Do NOT implement the full chat UI in this phase.

The chat page may contain a placeholder such as:

"AskMe Chat Interface"

"Chat experience will be implemented in the next phase."

The purpose is to validate:

- Routing
- Layout
- Theme
- i18n
- RTL
- Authentication boundaries
- Responsive behavior
- Component architecture

============================================================
39. IMPLEMENTATION ORDER
============================================================

Execute in this order:

STEP 1
Initialize project.

STEP 2
Configure TypeScript, ESLint, Prettier and pnpm.

STEP 3
Create folder architecture.

STEP 4
Configure Tailwind and shadcn/ui.

STEP 5
Establish design tokens.

STEP 6
Establish theme architecture.

STEP 7
Establish i18n.

STEP 8
Establish RTL.

STEP 9
Establish authentication boundary.

STEP 10
Establish API architecture.

STEP 11
Establish mock API capability.

STEP 12
Create base UI components.

STEP 13
Create application shell.

STEP 14
Create minimal route/page foundations.

STEP 15
Configure testing.

STEP 16
Configure CI.

STEP 17
Create documentation.

STEP 18
Create coding standards.

STEP 19
Create contribution guidelines.

STEP 20
Create ADRs.

STEP 21
Perform security/accessibility/architecture review.

STEP 22
Fix issues.

============================================================
40. QUALITY GATES
============================================================

Before completing Phase 1:

Verify:

- TypeScript passes.
- ESLint passes.
- Formatting passes.
- Tests pass.
- E2E smoke test passes.
- Production build passes.
- Light mode works.
- Dark mode works.
- System theme works.
- English works.
- French works.
- Arabic works.
- Portuguese works.
- RTL works.
- Responsive layouts work.
- Authentication boundaries are established.
- API abstraction exists.
- Mock mode works.
- No secrets are committed.
- No unnecessary dependencies exist.

============================================================
41. DOCUMENTATION SYNCHRONIZATION
============================================================

Whenever implementation changes:

1. Review affected documentation.
2. Update architecture documentation where necessary.
3. Update security documentation where necessary.
4. Update i18n documentation where necessary.
5. Update theme documentation where necessary.
6. Update accessibility documentation where necessary.
7. Update API documentation where necessary.
8. Update ADRs for significant architectural changes.
9. Update changelog.

A meaningful implementation change is not complete until affected documentation has been reviewed.

============================================================
42. FINAL REPORT
============================================================

After completing Phase 1, provide:

1. Project structure created.
2. Technology stack.
3. Architectural decisions.
4. Authentication foundation.
5. Security foundation.
6. API foundation.
7. Mock API approach.
8. Internationalization.
9. RTL.
10. Dark mode.
11. Accessibility.
12. Testing foundation.
13. CI foundation.
14. Documentation created.
15. Coding standards created.
16. Contribution guidelines created.
17. ADRs created.
18. Minimal UI shell created.
19. Known limitations.
20. What is intentionally deferred to Phase 2.

Also provide commands to:

- Install
- Run locally
- Run tests
- Run lint
- Run type checking
- Build

============================================================
FINAL INSTRUCTION
============================================================

BUILD THE FOUNDATION.

Do not merely generate documentation.

Do not implement the full chatbot.

Do not implement RAG.

Do not implement LLM integration.

Do not implement agent functionality.

Do not implement enterprise integrations.

Create a clean, production-oriented frontend foundation that is ready for the next phase.

Before finishing, inspect the entire repository against this specification and correct inconsistencies.