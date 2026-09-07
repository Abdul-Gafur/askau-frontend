"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MoonIcon, SunIcon } from "lucide-react";

import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  /** Render without the mode name, for tight spaces. */
  compact?: boolean;
  className?: string;
}

/**
 * ThemeToggle — flips between light and dark mode.
 *
 * The app defaults to `system` (see app/[locale]/layout.tsx), so the button reads
 * `resolvedTheme` to decide what it is currently showing and writes an explicit
 * "light" / "dark" on click — after which the choice is persisted by next-themes.
 *
 * Rendered on the login page so staff can pick a mode *before* authenticating,
 * where the sidebar and header toggles are not yet available.
 */
export function ThemeToggle({ compact = false, className }: ThemeToggleProps) {
  const t = useTranslations("navigation.themeToggle");
  const { setTheme, resolvedTheme } = useTheme();

  // resolvedTheme is unknown until the client has read localStorage / the media
  // query, so the icon is held back for one paint to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? t("lightMode") : t("darkMode");

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      {isDark ? (
        <SunIcon className="size-4" aria-hidden="true" />
      ) : (
        <MoonIcon className="size-4" aria-hidden="true" />
      )}
      {!compact && <span>{isDark ? t("light") : t("dark")}</span>}
    </button>
  );
}
