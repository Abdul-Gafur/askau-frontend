"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { CheckIcon, GlobeIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeDisplayNames, locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

interface LocaleSwitcherProps {
  /** Render without the language name, for tight spaces. */
  compact?: boolean;
  className?: string;
}

/**
 * LocaleSwitcher — changes the active locale by swapping the leading path segment.
 *
 * Routing uses `localePrefix: "always"` (see i18n/routing.ts), so every path begins
 * with a locale segment and switching is a pure path rewrite. The query string is
 * read from `window.location` inside the handler rather than via `useSearchParams`,
 * which keeps this component out of a Suspense boundary.
 *
 * Placed on the login page so staff can choose a language *before* authenticating.
 */
export function LocaleSwitcher({ compact = false, className }: LocaleSwitcherProps) {
  const t = useTranslations("auth");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(nextLocale: Locale) {
    if (nextLocale === activeLocale) return;

    // pathname is always "/{locale}" or "/{locale}/...", so replace segment 1.
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    const search = typeof window === "undefined" ? "" : window.location.search;

    startTransition(() => {
      router.replace(`${segments.join("/")}${search}`);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("changeLanguage")}
        disabled={isPending}
        className={cn(
          "inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-60",
          className,
        )}
      >
        <GlobeIcon className="size-4" aria-hidden="true" />
        {!compact && localeDisplayNames[activeLocale as Locale]}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-40">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onSelect={() => switchTo(locale)}
            lang={locale}
            className="justify-between gap-4"
          >
            {localeDisplayNames[locale]}
            {locale === activeLocale && <CheckIcon className="size-4" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
