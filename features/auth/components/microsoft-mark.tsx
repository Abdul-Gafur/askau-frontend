/**
 * MicrosoftMark — the four-square Microsoft logo.
 *
 * Decorative only: the button it sits in already names the provider in text,
 * so this is hidden from assistive technology.
 *
 * The literal hex values are deliberate and must NOT become tokens - these are
 * Microsoft's brand colours and have to stay identical in both themes. This is
 * the documented exception in docs/theming/dark-mode.md rule 1.
 */
export function MicrosoftMark() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="7" height="7" fill="#F25022" />
      <rect x="9" y="0" width="7" height="7" fill="#7FBA00" />
      <rect x="0" y="9" width="7" height="7" fill="#00A4EF" />
      <rect x="9" y="9" width="7" height="7" fill="#FFB900" />
    </svg>
  );
}
