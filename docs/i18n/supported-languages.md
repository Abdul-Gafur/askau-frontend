# Supported Languages

The AskAU Platform currently targets the following primary languages used within the African Union:

- **English** (`en`) - Left-to-Right
- **French** (`fr`) - Left-to-Right
- **Portuguese** (`pt`) - Left-to-Right
- **Arabic** (`ar`) - Right-to-Left (RTL)

## The Default Language

The default language for the application is **English (`en`)**. If a user visits the root URL `/` without a language preference cookie, they will be redirected to `/en`.

## Adding a New Language

If the AU mandates support for a new language (e.g., Swahili `sw`), follow these steps:

1. **Update Config:** Add the new locale code to the locales array in your `i18n` configuration file and Next.js middleware.
2. **Create Dictionary:** Create a new JSON file in the `messages/` folder (e.g., `messages/sw.json`).
3. **Copy Base Strings:** Copy the contents of `messages/en.json` into the new file as a starting point to ensure no keys are missing.
4. **Update Language Switcher:** Add the new language to the UI component that allows users to switch languages (`LanguageSelector`).
5. **Check Direction:** Determine if the language is LTR or RTL and update the HTML `dir` attribute logic in the root layout if necessary.