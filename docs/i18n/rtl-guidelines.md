# RTL (Right-to-Left) Guidelines

Because AskAU supports **Arabic**, our UI must seamlessly flip when the locale changes to `ar`.

## The Golden Rule: Use CSS Logical Properties

Never use physical directional CSS properties (like `left`, `right`, `margin-left`). Always use **CSS Logical Properties**.

Tailwind CSS supports logical properties natively.

### DO NOT USE (Physical Properties)

- `ml-4` (margin-left)
- `pr-2` (padding-right)
- `border-l` (border-left)
- `left-0` (left)
- `text-left` (text-align: left)

### DO USE (Logical Properties)

- `ms-4` (margin-inline-start) - Applies to the left in LTR, right in RTL.
- `pe-2` (padding-inline-end) - Applies to the right in LTR, left in RTL.
- `border-s` (border-inline-start)
- `start-0` (inset-inline-start)
- `text-start` (text-align: start)

## Flexbox and Grid are your friends

Flexbox and CSS Grid are naturally direction-aware.

- `flex-row` will automatically lay items out Left-to-Right in English, and Right-to-Left in Arabic.
- You do not need to change flex-direction for RTL unless you specifically want to reverse the natural order.

## Icons and Arrows

Directional icons (like a "back" arrow pointing left) often need to flip in RTL.

- Use the `rtl:scale-x-[-1]` Tailwind class to horizontally flip an SVG icon when in RTL mode.

```tsx
<ArrowRightIcon className="rtl:scale-x-[-1]" />
```

## Testing RTL

Always switch your local environment to Arabic (`/ar`) before submitting a Pull Request to visually verify that the layout does not break, margins are correct, and icons point the right way.
