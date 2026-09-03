"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

interface DevBypassButtonProps {
  redirectTo: string;
}

/**
 * The seeded backend identities, with what makes each one worth signing in as.
 *
 * A picker rather than one fixed user, because the product's central claim is
 * that two people asking the same question get different answers. That is not
 * observable from a single identity — the whole authorization layer looks like
 * a no-op until you can switch between them.
 */
const DEV_IDENTITIES = [
  { username: "staff.finance", label: "sees confidential Finance material" },
  { username: "staff.hr", label: "sees confidential HR material" },
  { username: "staff.legal", label: "Legal Counsel" },
  { username: "staff.peace", label: "Peace and Security" },
  { username: "staff.dual", label: "two departments — widest staff access" },
  { username: "staff.new", label: "new joiner — narrowest access" },
  { username: "exec.office", label: "Executive Office — highly restricted" },
  { username: "admin.knowledge", label: "knowledge administrator" },
  { username: "admin.system", label: "system administrator" },
  { username: "admin.security", label: "security administrator" },
] satisfies { username: string; label: string }[];

/**
 * DevBypassButton — signs in as a seeded backend user without touching Entra ID.
 *
 * Pairs with the CredentialsProvider in lib/auth/config.ts, which is only
 * registered when NEXT_PUBLIC_USE_MOCK_API === "true". The username chosen here
 * becomes the session identity, and the server-side proxy at app/api/[...path]
 * uses it to select that person's backend token — so the access list being
 * exercised is a real one rather than a stand-in.
 *
 * SECURITY: the caller must gate this on BOTH the mock flag and a non-production
 * NODE_ENV. It is an authentication bypass and must never reach a real deployment.
 */
export function DevBypassButton({ redirectTo }: DevBypassButtonProps) {
  const t = useTranslations("auth");
  const [isPending, setIsPending] = useState(false);
  const [username, setUsername] = useState<string>(DEV_IDENTITIES[0]!.username);

  async function handleBypass() {
    setIsPending(true);
    try {
      await signIn("credentials", { username, redirectTo });
    } catch {
      setIsPending(false);
    }
  }

  return (
    <div className="mt-6 border-t border-border pt-4">
      <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {t("devBypassTitle")}
      </p>
      <label htmlFor="dev-identity" className="sr-only">
        Development identity
      </label>
      <select
        id="dev-identity"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        disabled={isPending}
        className="mb-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      >
        {DEV_IDENTITIES.map((identity) => (
          <option key={identity.username} value={identity.username}>
            {identity.username} — {identity.label}
          </option>
        ))}
      </select>
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
