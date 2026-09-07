import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { LocaleSwitcher } from "@/components/common/locale-switcher";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { DevBypassButton } from "@/features/auth/components/dev-bypass-button";
import { LoginBrandPanel } from "@/features/auth/components/login-brand-panel";
import { LoginCard } from "@/features/auth/components/login-card";
import { LoginErrorAlert } from "@/features/auth/components/login-error-alert";
import { SignInButton } from "@/features/auth/components/sign-in-button";

/** Links the sign-in button to the error alert via aria-describedby. */
const ERROR_ALERT_ID = "login-error";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("signIn") };
}

interface LoginPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Login page — Microsoft Entra ID single sign-on.
 *
 * Server Component. Reads the error and callback from searchParams on the server,
 * so no Suspense boundary is needed and the page renders correctly without JS up to
 * the point of the sign-in click.
 *
 * SECURITY NOTES:
 * - No credentials are collected here — sign-in is password-less SSO.
 * - The redirect target is validated by NextAuth, so it is not an open-redirect vector.
 *   The incoming ?callbackUrl= is set by proxy.ts when it bounces an unauthenticated request.
 * - The dev bypass is gated on the mock flag AND a non-production NODE_ENV.
 */
export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;
  const query = await searchParams;

  // Default to the locale-prefixed path. Routing uses localePrefix: "always", so a
  // bare "/chat" would cost an extra 307 through the i18n middleware.
  const redirectTo = typeof query.callbackUrl === "string" ? query.callbackUrl : `/${locale}/chat`;
  const errorCode = typeof query.error === "string" ? query.error : undefined;

  // Defence in depth: lib/auth/config.ts only registers the credentials provider
  // when the mock flag is set, but a production build must never offer a bypass
  // even if that flag were set by mistake.
  const showDevBypass =
    process.env.NEXT_PUBLIC_USE_MOCK_API === "true" && process.env.NODE_ENV !== "production";

  return (
    <div className="flex min-h-screen bg-background">
      <LoginBrandPanel />

      <main id="main-content" className="flex flex-1 flex-col px-6 py-6 sm:px-10">
        <div className="flex items-center justify-end gap-1">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>

        <div className="mx-auto my-auto w-full max-w-sm py-10">
          {errorCode && <LoginErrorAlert code={errorCode} id={ERROR_ALERT_ID} />}

          <LoginCard>
            <SignInButton
              redirectTo={redirectTo}
              {...(errorCode ? { describedBy: ERROR_ALERT_ID } : {})}
            />
            {showDevBypass && <DevBypassButton redirectTo={redirectTo} />}
          </LoginCard>
        </div>
      </main>
    </div>
  );
}
