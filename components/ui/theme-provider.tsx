"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/**
 * Theme Provider wrapper.
 * Wraps next-themes ThemeProvider to support Light / Dark / System themes.
 *
 * - Uses CSS class strategy for Tailwind dark mode compatibility.
 * - `suppressHydrationWarning` on <html> prevents flash-of-wrong-theme.
 * - `disableTransitionOnChange` prevents color flash on theme switch.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
