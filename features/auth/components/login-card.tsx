import { getTranslations } from "next-intl/server";

import { siteConfig } from "@/config/site";

interface LoginCardProps {
  /** The sign-in action(s) — rendered between the subtitle and the SSO notice. */
  children: React.ReactNode;
}

/**
 * LoginCard — heading, subtitle, sign-in action, and support footer.
 *
 * Deliberately holds no state: the only interactive parts are passed in as
 * children, keeping the "use client" boundary as small as possible.
 *
 * The AU mark is shown only below `md`, where LoginBrandPanel is hidden and the
 * page would otherwise carry no identity.
 */
export async function LoginCard({ children }: LoginCardProps) {
  const t = await getTranslations("auth");

  return (
    <div className="w-full">
      <span className="mb-6 flex size-10 items-center justify-center rounded-xl bg-foreground text-sm font-bold text-background md:hidden">
        AU
      </span>

      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("loginTitle")}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("loginSubtitle")}</p>

      <div className="mt-8">{children}</div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t("ssoNotice")}</p>

      <div className="mt-8 border-t border-border pt-5">
        <p className="text-xs leading-relaxed text-muted-foreground">{t("loginDescription")}</p>
        <a
          href={`mailto:${siteConfig.supportEmail}`}
          className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
        >
          {t("contactAdmin")}
        </a>
      </div>
    </div>
  );
}
