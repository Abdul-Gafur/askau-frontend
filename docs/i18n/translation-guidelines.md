# Translation Guidelines

Every user-facing string in the AskAU Frontend must be translated. **Never hardcode strings in your React components.**

## 1. Using `next-intl`

### In Server Components

Use `getTranslations` to fetch translations asynchronously.

```tsx
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```

### In Client Components

Use the `useTranslations` hook.

```tsx
'use client';
import { useTranslations } from 'next-intl';

export function ChatButton() {
  const t = useTranslations('Chat');
  return <button>{t('submit')}</button>;
}
```

## 2. Managing Dictionary Files

Translations are stored in JSON files in the `messages/` directory (e.g., `messages/en.json`).

### Naming Conventions
- Group keys logically by page or feature (e.g., `HomePage`, `ChatFeature`, `Common`).
- Use `camelCase` for keys.

```json
{
  "Common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "ChatFeature": {
    "placeholder": "Type your message here...",
    "sendButton": "Send"
  }
}
```

## 3. Dynamic Variables

When you need to insert variables into a string, use interpolation.

**JSON:**
```json
{
  "welcomeMessage": "Welcome back, {name}!"
}
```

**Component:**
```tsx
<p>{t('welcomeMessage', { name: user.firstName })}</p>
```

## 4. Rich Text

If a translation requires embedded HTML (like bolding a specific word or inserting a link), use rich text formatting in `next-intl`.

**JSON:**
```json
{
  "terms": "I agree to the <terms>Terms of Service</terms>."
}
```

**Component:**
```tsx
<p>
  {t.rich('terms', {
    terms: (chunks) => <a href="/terms" className="font-bold">{chunks}</a>
  })}
</p>
```