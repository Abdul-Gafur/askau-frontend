import { CircleAlertIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LoginErrorAlertProps {
  /** The NextAuth error code from the ?error= query parameter. */
  code: string;
  id: string;
}

/**
 * Maps a NextAuth error code onto localised copy.
 *
 * NextAuth is configured with `pages.error: "/login"` (lib/auth/config.ts), so
 * failures return here as ?error=<code> rather than to a separate error page.
 * Unrecognised codes fall back to the generic message — a raw code is never shown.
 */
const ERROR_COPY: Record<string, { titleKey: string; descriptionKey: string }> = {
  AccessDenied: { titleKey: "unauthorized", descriptionKey: "unauthorizedDescription" },
  SessionRequired: { titleKey: "authError", descriptionKey: "sessionExpired" },
  Verification: { titleKey: "authError", descriptionKey: "authErrorDescription" },
  Configuration: { titleKey: "authError", descriptionKey: "authErrorDescription" },
};

const FALLBACK_COPY = { titleKey: "authError", descriptionKey: "authErrorDescription" };

export async function LoginErrorAlert({ code, id }: LoginErrorAlertProps) {
  const t = await getTranslations("auth");
  const { titleKey, descriptionKey } = ERROR_COPY[code] ?? FALLBACK_COPY;

  return (
    <Alert id={id} variant="destructive" className="mb-6">
      <CircleAlertIcon aria-hidden="true" />
      <AlertTitle>{t(titleKey)}</AlertTitle>
      <AlertDescription>{t(descriptionKey)}</AlertDescription>
    </Alert>
  );
}
