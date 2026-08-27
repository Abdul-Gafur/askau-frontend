# Dark Mode

The AskAU Frontend fully supports Dark Mode to improve accessibility and user experience in low-light environments.

## Implementation

We use `next-themes` to toggle a `.dark` class on the root HTML element. 

When the `.dark` class is present, the CSS variables defined in `globals.css` under the `.dark` selector override the default (light) variables.

## Developer Rules

1. **No Hardcoded Colors:** Never use colors like `bg-white`, `text-black`, `bg-blue-600` unless you explicitly want that color to remain identical in both light and dark modes.
2. **Use Semantic Tokens:** Always use semantic classes:
   - `bg-background` for page backgrounds.
   - `bg-card` for container backgrounds.
   - `text-foreground` for main text.
   - `text-muted-foreground` for secondary text.
   - `border-border` for borders.
3. **Dark Variant:** If a semantic token doesn't quite fit, you can use the `dark:` variant in Tailwind (e.g., `bg-slate-100 dark:bg-slate-800`), but this should be rare.

## Testing

Always test your UI changes by toggling the theme switcher in the UI before submitting a PR.