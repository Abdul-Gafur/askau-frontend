You are a Senior Staff Frontend Engineer, UI/UX Engineer, and Product Designer working on the AskMe frontend.

The AskMe frontend foundation has already been created.

Your task in this phase is to IMPLEMENT THE ASK AU CHAT USER INTERFACE on top of the existing foundation.

============================================================
IMPORTANT SCOPE
============================================================

This phase is primarily about:

CHAT UX
+
CHAT UI
+
CONVERSATION UI
+
CITATION UI
+
FEEDBACK UI
+
LOADING/ERROR STATES
+
RESPONSIVE EXPERIENCE
+
ACCESSIBILITY
+
DARK MODE
+
MULTILINGUAL SUPPORT
+
MOCK API INTEGRATION

Do NOT implement:

- RAG
- Vector search
- Embeddings
- Document ingestion
- OCR
- LLM infrastructure
- Production AI provider integration
- MIS integration
- HR integration
- Microsoft 365 integration
- Agent execution
- Tool execution
- Enterprise workflows

The backend/platform does not belong in this repository.

Use the existing API abstraction and mock API layer.

============================================================
1. USE THE EXISTING FOUNDATION
============================================================

Before implementing anything:

Inspect the existing repository.

Understand:

- Existing architecture
- Existing components
- Existing design tokens
- Existing theme system
- Existing i18n system
- Existing RTL implementation
- Existing API abstraction
- Existing authentication boundaries
- Existing testing structure
- Existing documentation

DO NOT recreate existing infrastructure.

DO NOT introduce duplicate components.

DO NOT restructure the project unless there is a genuine architectural problem.

If a change to the existing architecture is required, document it.

============================================================
2. PRIMARY CHAT EXPERIENCE
============================================================

Implement the main AskMe chat interface.

The primary flow should be:

User
 ↓
Ask a question
 ↓
AskMe response
 ↓
Sources/citations
 ↓
Follow-up question

The UI should feel like an enterprise knowledge assistant rather than a generic consumer AI application.

============================================================
3. CHAT PAGE
============================================================

Implement:

/chat

The page should contain:

HEADER

- Org/AskMe identity
- Language selector
- Theme selector
- User menu

SIDEBAR

- New conversation
- Conversation history
- Current conversation
- Settings

MAIN CHAT AREA

- Welcome state
- Messages
- AI response
- Citations
- Feedback
- Loading/generation state
- Error state
- Message composer

============================================================
4. WELCOME STATE
============================================================

Create a clean AskMe welcome state.

Concept:

"How can AskMe help you?"

Supporting message:

"Ask questions about approved African Union policies, procedures, guidelines and other organizational resources."

Suggested questions may include:

- What is the annual leave policy?
- How do I request official travel?
- What are the procurement procedures?
- Where can I find the staff regulations?

These are UI examples only.

Do not imply that the corresponding documents exist unless returned by the backend.

Suggested questions should be clickable and populate/submit through the normal chat interaction flow.

============================================================
5. MESSAGE COMPONENT
============================================================

Create reusable message components.

Support:

USER MESSAGE

and:

AskMe MESSAGE

Each message should support:

- Text
- Markdown
- Paragraphs
- Lists
- Tables where appropriate
- Code blocks where appropriate
- Links where appropriate
- Citations

Do not render arbitrary HTML unsafely.

Sanitize/securely render any untrusted rich content.

============================================================
6. CHAT COMPOSER
============================================================

Create a polished message composer.

Support:

- Text input
- Send
- Disabled state
- Loading state
- Stop generation
- Keyboard submission
- Multiline input
- Character handling where appropriate

Expected behavior:

Enter
→ send

Shift + Enter
→ new line

The behavior should be accessible and intuitive.

On mobile, ensure the composer remains usable with the virtual keyboard.

============================================================
7. GENERATION STATE
============================================================

Create an AI generation state.

Example:

AskMe is generating...

Use a subtle and professional loading indicator.

Do not use excessive animations.

Support:

- Generation in progress
- Stop generation
- Generation completed
- Generation failed

The UI must remain responsive while generation is occurring.

============================================================
8. STREAMING-READY UI
============================================================

The UI must be designed to support future streaming responses.

The backend may eventually send:

partial response
→ partial response
→ partial response
→ final response

Design the message component so that streaming can be introduced without redesigning the chat interface.

For now, mock the behavior if necessary.

Do not build a fake LLM.

Do not connect to an actual LLM.

============================================================
9. CITATIONS
============================================================

Citations are a CORE AskMe feature.

Create a high-quality citation experience.

Example:

AskMe response:

"According to the applicable Org policy..."

[1] Org Staff Regulations
Section 4.2
Page 12

View source →

A citation should support:

- Document title
- Document type
- Section
- Page
- Version
- Date
- Source identifier
- Source URL/deep link where provided

The UI must only display source metadata supplied by the backend.

The frontend must NEVER bypass backend permissions to retrieve documents.

============================================================
10. CITATION INTERACTION
============================================================

Support:

- Inline citation
- Citation hover/focus
- Citation expansion
- Source preview
- View source action

Create accessible citation interactions.

Support:

Keyboard navigation
Screen readers
Mobile interaction

If the backend provides no source:

display an appropriate "source unavailable" state.

============================================================
11. CONVERSATION HISTORY
============================================================

Implement the conversation history interface.

Support:

- New conversation
- Conversation list
- Conversation title
- Recent conversations
- Open conversation
- Rename conversation
- Delete conversation where API contract supports it

Do not persist complete conversation history in localStorage.

Actual conversation history should eventually come from the backend.

Use mock API responses for development.

============================================================
12. NEW CONVERSATION
============================================================

Create a clear new-conversation action.

When selected:

- Clear the current chat state.
- Show the welcome state.
- Prepare the composer.
- Create a new conversation only through the appropriate API boundary when implemented.

Do not directly manipulate backend data.

============================================================
13. FEEDBACK
============================================================

Create response feedback controls.

At minimum:

👍 Helpful

👎 Not helpful

Provide an optional feedback mechanism.

Do not require users to provide feedback.

Feedback should eventually be sent through the API.

For now, use the mock API layer.

Do not log sensitive message content unnecessarily.

============================================================
14. COPY RESPONSE
============================================================

Allow users to copy an AskMe response.

Provide clear feedback:

"Copied"

Ensure copied content is useful and does not unintentionally include UI-only elements.

Consider whether citations should be included in copied content and implement a consistent documented behavior.

============================================================
15. REGENERATE RESPONSE
============================================================

Provide a regenerate action where appropriate.

The UI should clearly indicate that regeneration may produce a different answer.

Use the API abstraction.

For now, use mock behavior.

============================================================
16. ERROR STATES
============================================================

Design professional error states.

Examples:

"AskMe is temporarily unavailable."

"Your request could not be completed."

"Your session has expired."

"Please try again."

Support:

- Retry
- Dismiss
- Return to chat
- Authentication recovery where applicable

Do not display:

- Stack traces
- Internal service names
- Database errors
- API implementation details
- Tokens
- Secrets

============================================================
17. EMPTY STATES
============================================================

Create appropriate empty states for:

- No conversations
- No search results
- No citations
- No available sources
- New conversation

Avoid excessive empty-state illustrations.

Keep them professional and informative.

============================================================
18. CONVERSATION SEARCH
============================================================

If the existing architecture supports conversation search, implement the UI.

Search should support:

- Search input
- Loading state
- Results
- No results
- Clear search

Do not implement backend search infrastructure.

Use the API/mock layer.

============================================================
19. RESPONSIVE DESIGN
============================================================

The chat experience must work on:

- Desktop
- Laptop
- Tablet
- Mobile

Desktop is the primary enterprise environment.

On mobile:

- Sidebar becomes a drawer/sheet.
- Composer remains fixed/accessible.
- Messages remain readable.
- Citations remain usable.
- Header controls remain accessible.

Test multiple viewport sizes.

============================================================
20. DARK MODE
============================================================

The chat UI must fully support the existing theme system.

Verify:

Light
Dark
System

Test:

- Chat background
- Messages
- Citations
- Sidebar
- Composer
- Buttons
- Dialogs
- Errors
- Loading states
- Empty states

Do not introduce isolated colors outside the existing design-token system unless necessary.

============================================================
21. MULTILINGUAL CHAT
============================================================

Support:

English
French
Arabic
Portuguese

All UI text must use translation keys.

Translate:

- Welcome text
- Buttons
- Tooltips
- Error messages
- Empty states
- Loading states
- Feedback
- Conversation controls
- Settings
- Navigation

Do not hard-code strings.

============================================================
22. RTL CHAT
============================================================

Arabic must operate correctly in RTL.

Test:

- User messages
- AskMe messages
- Composer
- Sidebar
- Citations
- Navigation
- Icons
- Dialogs
- Dropdowns
- Feedback controls

Use logical CSS properties.

Do not duplicate components for RTL.

============================================================
23. AI RESPONSE LANGUAGE
============================================================

When submitting a message through the API abstraction, include the user's locale where appropriate.

Example conceptual request:

{
  "message": "...",
  "locale": "en"
}

The backend remains responsible for:

- RAG
- LLM
- language generation
- translation
- source retrieval

The frontend only communicates the user's selected locale and renders the returned response.

============================================================
24. ACCESSIBILITY
============================================================

Target:

WCAG 2.2 AA

The chat experience must support:

- Keyboard navigation
- Screen readers
- Focus management
- Accessible message composer
- Accessible buttons
- Accessible citations
- Accessible loading state
- Accessible error state
- Accessible dialogs
- Visible focus
- Reduced motion

Chat updates should be communicated appropriately to assistive technologies without becoming excessively verbose.

============================================================
25. SECURITY
============================================================

Treat chat content as potentially sensitive enterprise information.

Do not:

- Store complete conversations unnecessarily.
- Send chat messages to third-party analytics.
- Log full message contents unnecessarily.
- Expose API credentials.
- Expose tokens.
- Bypass backend authorization.
- Fetch documents directly from storage.
- Embed LLM credentials in frontend code.

The frontend must only consume data exposed through the AskMe API.

============================================================
26. MOCK API
============================================================

Use the existing mock API architecture.

Create realistic mock responses for:

- Conversation
- Message
- Citation
- Chat response
- Feedback
- Conversation list

Mock responses should demonstrate:

1. Successful response
2. Response with citations
3. Multiple citations
4. Loading
5. Error
6. Empty result
7. No authoritative source

Do not make mock data look like actual verified Org policy content unless clearly identified as demonstration content.

============================================================
27. API CONTRACT
============================================================

Use typed models.

Conceptually support:

POST /conversations

POST /conversations/{id}/messages

GET /conversations

GET /conversations/{id}

DELETE /conversations/{id}

POST /messages/{id}/feedback

Actual endpoint names must follow the existing API contract if already defined.

Do NOT invent backend functionality beyond what is required.

============================================================
28. COMPONENT ARCHITECTURE
============================================================

Create reusable components such as:

ChatLayout
ChatHeader
ChatSidebar
ConversationList
ConversationItem
ChatMessage
UserMessage
AssistantMessage
MessageComposer
Citation
CitationList
CitationPreview
FeedbackControls
GenerationIndicator
ErrorMessage
EmptyChat
SuggestedQuestion
SourcePreview

Do not create excessively small components without a meaningful reason.

Keep domain-specific components inside appropriate feature boundaries.

============================================================
29. CHAT STATE
============================================================

Separate:

Server state

from:

UI state.

Use:

TanStack Query

for server state.

Use React state for local UI state.

Do not introduce Redux.

Ensure state transitions are predictable.

============================================================
30. CHAT DATA FLOW
============================================================

The intended flow is:

User
 ↓
Message Composer
 ↓
Chat Feature
 ↓
Chat Service
 ↓
API Client
 ↓
AskMe Platform API
 ↓
RAG/Search/LLM
 ↓
API Response
 ↓
Chat Service
 ↓
Chat UI
 ↓
User

The frontend must never directly access:

RAG
Search
LLM
Vector database
Document repository

============================================================
31. FUTURE AGENT READINESS
============================================================

Do not implement agents.

However, ensure message architecture can eventually support different response types.

For example:

type:
"answer"

future:

type:
"tool_execution"

future:

type:
"approval_required"

future:

type:
"task_progress"

future:

type:
"system_result"

Do not implement these future types visually unless needed for architecture.

Do not build the agent system.

============================================================
32. PERFORMANCE
============================================================

Optimize the chat experience appropriately.

Pay attention to:

- Large conversation histories
- Message rendering
- Virtualization only if genuinely necessary
- Markdown rendering
- Citation rendering
- Component re-renders
- Bundle size
- Lazy loading
- Client/server boundaries

Do not prematurely introduce complex virtualization.

============================================================
33. TESTING
============================================================

Create meaningful tests for:

Chat rendering
Message composer
Send message
Loading state
Generation state
Stop generation
Error state
Retry
Citation rendering
Citation interaction
Conversation history
New conversation
Feedback
Copy response
Theme
Language
RTL
Responsive behavior
Accessibility

Create E2E scenarios:

1. Open AskMe.
2. Start a conversation.
3. Enter a question.
4. Submit.
5. Receive mock response.
6. View citation.
7. Submit follow-up.
8. Switch language.
9. Switch theme.

============================================================
34. VISUAL QUALITY
============================================================

The UI should feel:

- Enterprise-grade
- Professional
- Clean
- Calm
- Trustworthy
- Modern
- Minimal
- Information-focused

Avoid:

- Excessive gradients
- Excessive animation
- Huge hero sections
- Excessive cards
- Consumer-style AI gimmicks
- Unnecessary controls

The primary experience is:

QUESTION
↓
ANSWER
↓
EVIDENCE
↓
SOURCE
↓
FOLLOW-UP

============================================================
35. Org CONTEXT
============================================================

The application should visually feel appropriate for an African Union Commission institutional environment.

Use the existing project branding/design tokens.

Do not invent official Org branding standards.

If official branding assets are unavailable, use placeholders and document where official assets need to be provided.

Do not fabricate official logos or claims.

============================================================
36. DOCUMENTATION
============================================================

Update documentation as part of the implementation.

Update:

docs/architecture/frontend-architecture.md

docs/architecture/frontend-data-flow.md

docs/api/api-integration.md

docs/api/api-contract.md

docs/accessibility/wcag.md

docs/i18n/

docs/theming/

docs/security/

Update:

docs/changelog.md

Add the chat UI implementation under:

## [Unreleased]

### Added

Document significant architectural changes with ADRs.

============================================================
37. COMPONENT GUIDELINES
============================================================

Update:

docs/development/component-guidelines.md

Document:

- Component naming
- Component responsibilities
- Props
- State
- Accessibility
- i18n
- RTL
- Theme support
- Testing
- Reusability
- When to create a component
- When NOT to create a component

============================================================
38. CODE REVIEW
============================================================

Before completion review:

Architecture
Security
Privacy
Accessibility
i18n
RTL
Dark mode
Responsive behavior
Performance
Type safety
Testing
Documentation

Fix identified issues.

============================================================
39. QUALITY GATES
============================================================

Before considering this phase complete:

Verify:

- TypeScript passes.
- ESLint passes.
- Formatting passes.
- Unit tests pass.
- Component tests pass.
- Accessibility tests pass.
- E2E tests pass.
- Production build passes.

Verify:

- Light mode
- Dark mode
- System theme
- English
- French
- Arabic
- Portuguese
- RTL
- Mobile
- Desktop
- Loading
- Error
- Empty states
- Citation states
- Feedback
- Conversation history

============================================================
40. IMPORTANT SCOPE RESTRICTION
============================================================

Do not:

- Integrate a real LLM.
- Integrate Azure OpenAI.
- Integrate OpenAI directly.
- Integrate Gemini.
- Integrate vector databases.
- Implement embeddings.
- Implement RAG.
- Implement document ingestion.
- Implement document storage.
- Implement enterprise system integration.
- Implement agents.
- Implement tool execution.
- Implement MIS operations.

Those belong to the AskMe platform/backend phases.

============================================================
41. FINAL REVIEW
============================================================

After implementation:

Inspect the complete frontend.

Check for:

- Duplicate components
- Inconsistent spacing
- Inconsistent typography
- Hard-coded strings
- Missing translations
- RTL issues
- Dark-mode issues
- Accessibility issues
- Security issues
- Incorrect state handling
- Unnecessary dependencies
- API boundary violations
- Documentation gaps

Fix all issues found.

============================================================
42. FINAL REPORT
============================================================

Provide:

1. Chat UI implemented.
2. Components created.
3. Conversation experience.
4. Citation experience.
5. Feedback experience.
6. Loading/error states.
7. Mock API implementation.
8. Multilingual implementation.
9. RTL implementation.
10. Dark mode implementation.
11. Accessibility implementation.
12. Responsive implementation.
13. Tests created.
14. Documentation updated.
15. Any architectural changes.
16. Known limitations.
17. Recommended next step.

Clearly state which functionality remains dependent on the AskMe backend/platform.

============================================================
FINAL INSTRUCTION
============================================================

IMPLEMENT THE ASK AU CHAT EXPERIENCE.

Build on the existing foundation.

Do not recreate the foundation.

Do not build the backend.

Do not build RAG.

Do not integrate an LLM.

Do not build agents.

Create a polished, production-oriented, accessible, multilingual, RTL-ready, dark-mode-ready AskMe chat experience using the existing API and mock boundaries.

Before finishing, review the implementation against this entire specification and correct inconsistencies.