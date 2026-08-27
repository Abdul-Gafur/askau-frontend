# Design Tokens

Our design system is tokenized into CSS variables within `src/app/globals.css`. These variables are automatically mapped to Tailwind utility classes.

## Color Tokens

We use HSL color values for flexibility (e.g., easily applying opacity with `bg-primary/50`).

| Variable | Description |
|---|---|
| `--background` | Default page background |
| `--foreground` | Default text color |
| `--card` | Background for cards and containers |
| `--card-foreground` | Text inside cards |
| `--popover` | Background for dropdowns, popovers, tooltips |
| `--primary` | Primary brand color (buttons, active states) |
| `--secondary` | Secondary / muted brand color |
| `--muted` | Muted backgrounds (e.g., disabled states) |
| `--accent` | Highlighted elements |
| `--destructive` | Error states, delete buttons |
| `--border` | Default border color |
| `--input` | Border color for inputs |
| `--ring` | Focus ring color for accessibility |

## Radius Tokens

We use `--radius` to maintain consistent border radii across all components (e.g., `rounded-md`, `rounded-lg`).

## Changing Tokens

To update a color across the entire application, simply modify its HSL value in `globals.css` (for both `:root` and `.dark` blocks). Do not override colors in individual components unless it's a specific exception.