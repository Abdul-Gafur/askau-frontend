# Component Guidelines

Writing clean, maintainable components is essential for the long-term health of the project.

## 1. Server vs Client Components

Next.js 15 defaults all components to **Server Components**.
- **Use Server Components** for static content, fetching data securely, and rendering initial HTML.
- **Use Client Components** (`"use client"`) only when necessary:
  - When using React hooks (`useState`, `useEffect`, etc.).
  - When attaching event listeners (`onClick`, `onChange`).
  - When using browser APIs (`window`, `document`).

**Guideline:** Push the `"use client"` boundary as far down the component tree as possible. Don't make a whole page a Client Component just for one interactive button.

## 2. Component Structure

A typical component file should follow this structure:

1. **Imports:** Grouped logically (React/Next, 3rd party, absolute internal, relative).
2. **Types:** Define props interface clearly (export if needed elsewhere, but try to keep it local if possible).
3. **Component Definition:** Use `function` declarations (not arrow functions) for better stack traces.
4. **Export:** Default export at the bottom.

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  // Component logic
  return (
    <div>...</div>
  );
}
```

## 3. Keep Components Small

If a component grows beyond 200-300 lines, consider breaking it down.
- Extract complex UI into sub-components.
- Extract complex logic into custom hooks.

## 4. Business Logic Separation

UI components should be "dumb". They should receive data via props and emit events via callbacks.
- **Do not** fetch data directly inside a low-level UI component.
- **Do not** write heavy data transformation logic inside a component. Move it to a utility function or a hook.

## 5. Using shadcn/ui

We use `shadcn/ui` for primitive components.
- Do not modify the primitive components in `components/ui/` unless adding global capabilities.
- Compose them together in your feature folders or `components/common/`.