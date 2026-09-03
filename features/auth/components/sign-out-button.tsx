"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { LoaderCircleIcon, LogOutIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SignOutButtonProps {
  className?: string;
}

/**
 * SignOutButton — destroys the session and returns the user to the login page.
 *
 * Redirects to the locale-prefixed /login rather than "/" so the user lands on a
 * page they can actually act on. Routing uses localePrefix: "always", so an
 * unprefixed "/login" would cost an extra 307 through the i18n middleware.
 *
 * Icon-only, so it carries an aria-label — see docs/accessibility/wcag.md §5.
 */
export function SignOutButton({ className }: SignOutButtonProps) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const label = isSigningOut ? t("signingOut") : t("signOut");

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut({ redirectTo: `/${locale}/login` });
    } catch {
      // Redirect failed — re-enable so the user can retry.
      setIsSigningOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      aria-label={label}
      title={label}
      className={cn(
        "flex-shrink-0 rounded-lg p-1.5 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60",
        className,
      )}
    >
      {isSigningOut ? (
        <LoaderCircleIcon className="h-[18px] w-[18px] animate-spin" aria-hidden="true" />
      ) : (
        <LogOutIcon className="h-[18px] w-[18px]" aria-hidden="true" />
      )}
    </button>
  );
}
