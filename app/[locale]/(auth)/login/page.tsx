"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

/**
 * Login page.
 * Presents the Microsoft Entra ID sign-in flow.
 * All authentication is handled by NextAuth + Microsoft Entra ID.
 *
 * SECURITY NOTES:
 * - No credentials are collected by this page (password-less SSO).
 * - The sign-in flow is initiated server-side via NextAuth.
 * - The callbackUrl is validated by NextAuth to prevent open redirects.
 */
export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/chat";
  const _error = searchParams.get("error");
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function _handleSignIn() {
    setIsSigningIn(true);
    try {
      await signIn("microsoft-entra-id", { callbackUrl });
    } catch {
      setIsSigningIn(false);
    }
  }

  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-background p-6"
    >
    

      {/* Maira, Please design the login page here. Use the Dev-only Mock below to bypass the login page to access the chat interface*/}




      {/* Dev-only Mock Login */}
      {process.env.NEXT_PUBLIC_USE_MOCK_API === "true" && (
        <div className="mt-4 border border-border pt-4">
          <button
            type="button"
            onClick={async () => {
              setIsSigningIn(true);
              try {
                await signIn("credentials", { callbackUrl });
              } catch {
                setIsSigningIn(false);
              }
            }}
            disabled={isSigningIn}
            className="flex w-full items-center justify-center rounded-lg bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Bypass Login (Dev Mode)
          </button>
        </div>
      )}
    </main>
  );
}
