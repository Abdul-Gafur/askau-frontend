"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

interface DevBypassButtonProps {
  redirectTo: string;
}

/**
 * DevBypassButton — signs in as a mock user without touching Entra ID.
 *
 * Pairs with the CredentialsProvider in lib/auth/config.ts, which is only
 * registered when NEXT_PUBLIC_USE_MOCK_API === "true".
 *
 * SECURITY: the caller must gate this on BOTH the mock flag and a non-production
 * NODE_ENV. It is an authentication bypass and must never reach a real deployment.
 */
export function DevBypassButton({ redirectTo }: DevBypassButtonProps) {
  const t = useTranslations("auth");
  const [isPending, setIsPending] = useState(false);

  async function handleBypass() {
    setIsPending(true);
    try {
      await signIn("credentials", { redirectTo });
    } catch {
      setIsPending(false);
    }
  }

  return (
    <div className="mt-6 border-t border-border pt-4">
      <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {t("devBypassTitle")}
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleBypass}
        disabled={isPending}
        className="w-full"
      >
        {t("devBypassAction")}
      </Button>
    </div>
  );
}
