"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LoaderCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MicrosoftMark } from "./microsoft-mark";

interface SignInButtonProps {
  /** Where to land after a successful sign-in. Validated by NextAuth. */
  redirectTo: string;
  /** id of the error alert, so screen readers hear the failure with the control. */
  describedBy?: string;
}

/**
 * SignInButton — initiates the Microsoft Entra ID sign-in flow.
 *
 * The only client component in the sign-in card. Local state is used rather than
 * useTransition because signIn() triggers a full navigation to the Entra ID
 * authorisation endpoint; the pending state only needs to survive until then.
 *
 * SECURITY: no credentials are collected here. redirectTo is validated by
 * NextAuth against the configured host, so it is not an open-redirect vector.
 */
export function SignInButton({ redirectTo, describedBy }: SignInButtonProps) {
  const t = useTranslations("auth");
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function handleSignIn() {
    setIsSigningIn(true);
    try {
      await signIn("microsoft-entra-id", { redirectTo });
    } catch {
      // Redirect failed — re-enable so the user can retry.
      setIsSigningIn(false);
    }
  }

  return (
    <Button
      type="button"
      size="lg"
      onClick={handleSignIn}
      disabled={isSigningIn}
      aria-describedby={describedBy}
      className="w-full"
    >
      {isSigningIn ? (
        <LoaderCircleIcon className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <MicrosoftMark />
      )}
      {isSigningIn ? t("signingIn") : t("signInWithMicrosoft")}
    </Button>
  );
}
